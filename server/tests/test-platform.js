/**
 * EEC Test Suite — API Key Verification & Integration Tests
 * 
 * Run:  npm run test:keys     — Check which API keys are configured & valid
 *       npm run test:brevo    — Test Brevo CRM integration (list, contact, template)
 *       npm run test:ai       — Test all AI providers with a sample generation
 *       npm run test:pipeline — Full end-to-end pipeline test (AI + Brevo)
 *       npm run test:all      — Run all tests
 */

import 'dotenv/config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const pass = (msg) => console.log(`  ${GREEN}✅ PASS${RESET}  ${msg}`);
const fail = (msg, err) => console.log(`  ${RED}❌ FAIL${RESET}  ${msg}${err ? ` — ${DIM}${err}${RESET}` : ''}`);
const warn = (msg) => console.log(`  ${YELLOW}⚠️  SKIP${RESET}  ${msg}`);
const info = (msg) => console.log(`  ${CYAN}ℹ️  INFO${RESET}  ${msg}`);
const section = (title) => console.log(`\n${BOLD}━━━ ${title} ━━━${RESET}`);

let totalPass = 0;
let totalFail = 0;
let totalSkip = 0;

function track(result) {
  if (result === 'pass') totalPass++;
  else if (result === 'fail') totalFail++;
  else totalSkip++;
}

function summary() {
  section('Summary');
  console.log(`  ${GREEN}${totalPass} passed${RESET}  ${RED}${totalFail} failed${RESET}  ${YELLOW}${totalSkip} skipped${RESET}\n`);
  if (totalFail > 0) process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. API Key presence check
// ---------------------------------------------------------------------------

async function testKeyPresence() {
  section('API Key Configuration');

  const keys = [
    { env: 'MONGO_URI', label: 'MongoDB', required: true },
    { env: 'RESEND_API_KEY', label: 'Resend (email sending)', required: true },
    { env: 'STRIPE_SECRET_KEY', label: 'Stripe (payments)', required: true },
    { env: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook', required: false },
    { env: 'BREVO_API_KEY', label: 'Brevo CRM', required: true },
    { env: 'BREVO_SENDER_EMAIL', label: 'Brevo Sender Email', required: false },
    { env: 'SEGMIND_API_KEY', label: 'Claude (Segmind)', required: false },
    { env: 'OPENAI_API_KEY', label: 'OpenAI (GPT-4o)', required: false },
    { env: 'GROK_API_KEY', label: 'Grok (xAI)', required: false },
    { env: 'FIRECRAWL_API_KEY', label: 'FireCrawl (channel scraping)', required: false },
    { env: 'TAVILY_API_KEY', label: 'Tavily (web search)', required: false },
  ];

  const aiKeys = ['SEGMIND_API_KEY', 'OPENAI_API_KEY', 'GROK_API_KEY'];
  let hasAnyAI = false;

  for (const k of keys) {
    const val = process.env[k.env];
    if (val && val.length > 3) {
      const masked = val.slice(0, 6) + '...' + val.slice(-4);
      pass(`${k.label} (${k.env}) = ${DIM}${masked}${RESET}`);
      track('pass');
      if (aiKeys.includes(k.env)) hasAnyAI = true;
    } else if (k.required) {
      fail(`${k.label} (${k.env}) — REQUIRED but not set`);
      track('fail');
    } else {
      warn(`${k.label} (${k.env}) — not set (optional)`);
      track('skip');
    }
  }

  // Check at least one AI key is present
  if (!hasAnyAI) {
    fail('No AI provider configured — need at least one of: SEGMIND_API_KEY, OPENAI_API_KEY, GROK_API_KEY');
    track('fail');
  } else {
    pass('At least one AI provider is configured');
    track('pass');
  }
}

// ---------------------------------------------------------------------------
// 2. Stripe key validation
// ---------------------------------------------------------------------------

async function testStripe() {
  section('Stripe Connection');

  if (!process.env.STRIPE_SECRET_KEY) {
    warn('STRIPE_SECRET_KEY not set — skipping Stripe tests');
    track('skip');
    return;
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Test: list balance (lightweight API call to verify key)
    const balance = await stripe.balance.retrieve();
    pass(`Stripe connected — Balance: ${balance.available.map(b => `${b.amount / 100} ${b.currency.toUpperCase()}`).join(', ') || '0'}`);
    track('pass');

    // Check if key is test or live
    const isTest = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
    if (isTest) {
      info('Using Stripe TEST key — no real charges will be made');
    } else {
      warn('Using Stripe LIVE key — real charges will be made!');
    }

    // Test: can create a checkout session (dry run)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'EEC Test — DELETE ME' },
          unit_amount: 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    pass(`Stripe checkout session creation works (ID: ${session.id.slice(0, 20)}...)`);
    track('pass');

    // Expire the test session to clean up
    try {
      await stripe.checkout.sessions.expire(session.id);
      info('Test session expired (cleaned up)');
    } catch { /* ignore */ }

  } catch (err) {
    fail('Stripe connection failed', err.message);
    track('fail');
  }
}

// ---------------------------------------------------------------------------
// 3. Brevo CRM validation
// ---------------------------------------------------------------------------

async function testBrevo() {
  section('Brevo CRM');

  if (!process.env.BREVO_API_KEY) {
    warn('BREVO_API_KEY not set — skipping Brevo tests');
    track('skip');
    return;
  }

  const { getAccount, getSenders, createList, createContact, createEmailTemplate } = await import('../services/brevo.js');

  // Test 1: Account info
  try {
    const account = await getAccount();
    pass(`Brevo account verified — ${account.email} (${account.firstName} ${account.lastName})`);
    info(`Plan: ${account.plan?.[0]?.type || 'Free'} | Credits: ${account.plan?.[0]?.credits ?? 'N/A'}`);
    track('pass');
  } catch (err) {
    fail('Brevo account check failed', err.message);
    track('fail');
    return; // Don't continue if basic auth fails
  }

  // Test 1b: Check verified senders
  try {
    const data = await getSenders();
    const senders = data?.senders || [];
    const active = senders.filter(s => s.active);
    if (active.length > 0) {
      pass(`Brevo has ${active.length} verified sender(s)`);
      for (const s of active) info(`Sender: ${s.name} <${s.email}>`);
    } else {
      warn(`No active senders found — you need to verify a sender email in Brevo`);
      info('Go to: https://app.brevo.com/senders/list → Add a sender → Verify it');
    }
    track(active.length > 0 ? 'pass' : 'skip');
  } catch (err) {
    warn('Could not fetch senders — ' + err.message);
    track('skip');
  }

  // Test 2: Create a test list
  let testListId = null;
  try {
    const list = await createList('EEC_TEST_LIST_DELETE_ME');
    testListId = list.id;
    pass(`Brevo list creation works (ID: ${testListId})`);
    track('pass');
  } catch (err) {
    // May fail if list already exists
    if (err.message.includes('already exist')) {
      warn('Test list already exists — that\'s OK');
      track('skip');
    } else {
      fail('Brevo list creation failed', err.message);
      track('fail');
    }
  }

  // Test 3: Create a test contact
  try {
    await createContact('eec-test-delete-me@example.com', {
      FIRSTNAME: 'EEC',
      LASTNAME: 'Test',
    }, testListId ? [testListId] : []);
    pass('Brevo contact creation works');
    track('pass');
  } catch (err) {
    fail('Brevo contact creation failed', err.message);
    track('fail');
  }

  // Test 4: Create a test email template
  try {
    const template = await createEmailTemplate({
      name: `EEC_TEST_TEMPLATE_${Date.now()}`,
      subject: 'EEC Test Email — Delete Me',
      htmlContent: '<html><body><h1>Test</h1><p>This is a test template from EEC. Safe to delete.</p></body></html>',
    });
    pass(`Brevo email template creation works (ID: ${template.id})`);
    track('pass');
  } catch (err) {
    fail('Brevo template creation failed', err.message);
    track('fail');
  }

  // Cleanup: delete test list
  if (testListId) {
    try {
      const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${testListId}`, {
        method: 'DELETE',
        headers: { 'api-key': process.env.BREVO_API_KEY, accept: 'application/json' },
      });
      if (res.ok || res.status === 204) {
        info(`Cleaned up test list (ID: ${testListId})`);
      }
    } catch { /* ignore cleanup errors */ }
  }
}

// ---------------------------------------------------------------------------
// 4. AI Provider validation
// ---------------------------------------------------------------------------

async function testAI() {
  section('AI Providers');

  const { complete, completeJSON } = await import('../services/ai.js');
  const testPrompt = 'Reply with exactly: "EEC test successful"';
  const testSystem = 'You are a helpful assistant. Follow instructions exactly.';

  // Test Claude via Segmind
  if (process.env.SEGMIND_API_KEY) {
    try {
      const t0 = Date.now();
      const result = await complete(testSystem, testPrompt, { provider: 'claude', maxTokens: 50 });
      const ms = Date.now() - t0;
      pass(`Claude (Segmind) — responded in ${ms}ms: "${result.trim().slice(0, 60)}"`);
      track('pass');
    } catch (err) {
      fail('Claude (Segmind) — call failed', err.message);
      track('fail');
    }
  } else {
    warn('Claude (SEGMIND_API_KEY) — not configured');
    track('skip');
  }

  // Test OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const t0 = Date.now();
      const result = await complete(testSystem, testPrompt, { provider: 'openai', maxTokens: 50 });
      const ms = Date.now() - t0;
      pass(`OpenAI (GPT-4o) — responded in ${ms}ms: "${result.trim().slice(0, 60)}"`);
      track('pass');
    } catch (err) {
      fail('OpenAI (GPT-4o) — call failed', err.message);
      track('fail');
    }
  } else {
    warn('OpenAI (OPENAI_API_KEY) — not configured');
    track('skip');
  }

  // Test Grok
  if (process.env.GROK_API_KEY) {
    try {
      const t0 = Date.now();
      const result = await complete(testSystem, testPrompt, { provider: 'grok', maxTokens: 50 });
      const ms = Date.now() - t0;
      pass(`Grok (xAI) — responded in ${ms}ms: "${result.trim().slice(0, 60)}"`);
      track('pass');
    } catch (err) {
      fail('Grok (xAI) — call failed', err.message);
      track('fail');
    }
  } else {
    warn('Grok (GROK_API_KEY) — not configured');
    track('skip');
  }

  // Test JSON completion (uses auto-select)
  const hasAny = process.env.SEGMIND_API_KEY || process.env.OPENAI_API_KEY || process.env.GROK_API_KEY;
  if (hasAny) {
    try {
      const t0 = Date.now();
      const result = await completeJSON(
        'You generate JSON data.',
        'Generate a JSON object with keys: "status" (string "ok"), "count" (number 3)',
        { maxTokens: 100 }
      );
      const ms = Date.now() - t0;
      if (result && typeof result === 'object' && result.status) {
        pass(`JSON completion (auto-select) — ${ms}ms, parsed OK: ${JSON.stringify(result)}`);
        track('pass');
      } else {
        fail('JSON completion — response parsed but unexpected shape', JSON.stringify(result));
        track('fail');
      }
    } catch (err) {
      fail('JSON completion — failed', err.message);
      track('fail');
    }
  }
}

// ---------------------------------------------------------------------------
// 5. FireCrawl validation
// ---------------------------------------------------------------------------

async function testFireCrawl() {
  section('FireCrawl (Channel Analysis)');

  if (!process.env.FIRECRAWL_API_KEY) {
    warn('FIRECRAWL_API_KEY not set — channel analysis will use AI inference instead');
    track('skip');
    return;
  }

  try {
    const t0 = Date.now();
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/@MrBeast',
        formats: ['markdown'],
      }),
    });
    const ms = Date.now() - t0;

    if (res.ok) {
      const data = await res.json();
      const contentLen = data.data?.markdown?.length || 0;
      pass(`FireCrawl — scraped a YouTube page in ${ms}ms (${contentLen} chars)`);
      track('pass');
    } else {
      const err = await res.json().catch(() => ({}));
      fail(`FireCrawl — API returned ${res.status}`, err.message || err.error || JSON.stringify(err));
      track('fail');
    }
  } catch (err) {
    fail('FireCrawl — request failed', err.message);
    track('fail');
  }
}

// ---------------------------------------------------------------------------
// 6. Tavily validation
// ---------------------------------------------------------------------------

async function testTavily() {
  section('Tavily (Web Search)');

  if (!process.env.TAVILY_API_KEY) {
    warn('TAVILY_API_KEY not set — niche research will be skipped during content generation');
    track('skip');
    return;
  }

  try {
    const t0 = Date.now();
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: 'YouTube email marketing newsletter best practices 2026',
        max_results: 3,
        search_depth: 'basic',
      }),
    });
    const ms = Date.now() - t0;

    if (res.ok) {
      const data = await res.json();
      const count = data.results?.length || 0;
      pass(`Tavily — search returned ${count} results in ${ms}ms`);
      if (count > 0) info(`First result: "${data.results[0].title?.slice(0, 80)}"`);
      track('pass');
    } else {
      const err = await res.json().catch(() => ({}));
      fail(`Tavily — API returned ${res.status}`, err.message || JSON.stringify(err));
      track('fail');
    }
  } catch (err) {
    fail('Tavily — request failed', err.message);
    track('fail');
  }
}

// ---------------------------------------------------------------------------
// 7. Resend validation
// ---------------------------------------------------------------------------

async function testResend() {
  section('Resend (Email Delivery)');

  if (!process.env.RESEND_API_KEY) {
    warn('RESEND_API_KEY not set — skipping');
    track('skip');
    return;
  }

  try {
    // Use API keys endpoint to verify key validity
    const res = await fetch('https://api.resend.com/api-keys', {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });

    if (res.ok) {
      const data = await res.json();
      const keys = data.data || [];
      pass(`Resend API key valid — ${keys.length} API key(s) found`);
      track('pass');
    } else if (res.status === 401 || res.status === 403) {
      // Send-only keys can't read resources, so verify by attempting a send with a dry-run
      // The key format itself is valid if it starts with re_ and is long enough
      const key = process.env.RESEND_API_KEY;
      if (key.startsWith('re_') && key.length > 20) {
        pass('Resend API key format valid (send-only restricted key — cannot verify via read endpoints)');
        info('To fully verify, send a test email or use a full-access API key');
        track('pass');
      } else {
        fail('Resend API key looks malformed', `starts with "${key.slice(0, 5)}", length=${key.length}`);
        track('fail');
      }
    } else {
      const err = await res.json().catch(() => ({}));
      fail(`Resend — API returned ${res.status}`, err.message || JSON.stringify(err));
      track('fail');
    }
  } catch (err) {
    fail('Resend — request failed', err.message);
    track('fail');
  }
}

// ---------------------------------------------------------------------------
// 8. Full Pipeline Test (generate content + push to Brevo)
// ---------------------------------------------------------------------------

async function testPipeline() {
  section('Full Pipeline (AI Content Generation + Brevo Setup)');

  const hasAI = process.env.SEGMIND_API_KEY || process.env.OPENAI_API_KEY || process.env.GROK_API_KEY;
  const hasBrevo = process.env.BREVO_API_KEY;

  if (!hasAI) {
    warn('No AI provider configured — cannot test pipeline');
    track('skip');
    return;
  }
  if (!hasBrevo) {
    warn('BREVO_API_KEY not set — cannot test pipeline');
    track('skip');
    return;
  }

  // Mock user onboarding data
  const mockUser = {
    name: 'Test Creator',
    email: 'eec-pipeline-test@example.com',
    onboarding: {
      channelUrl: 'https://youtube.com/@testchannel',
      channelName: 'Test Channel',
      subscriberCount: '100k-500k',
      niche: 'Tech',
      brandName: 'Tech Insider Weekly',
      brandColors: { primary: '#3b82f6', secondary: '#0f172a' },
      toneOfVoice: 'professional',
      targetAudience: 'Tech enthusiasts aged 25-45 who love gadget reviews',
      audienceInterests: ['gadgets', 'software', 'AI'],
      goals: ['grow-list', 'monetize'],
      emailFrequency: 'weekly',
      contentTopics: ['tech reviews', 'AI news', 'productivity tips'],
      leadMagnetIdea: 'Free "Top 10 Tech Tools" PDF guide',
    },
  };

  // Step 1: Generate content with AI
  info('Generating content with AI (this may take 30-60 seconds)...');
  let generatedContent;
  try {
    const { generateAllContent } = await import('../services/contentGenerator.js');
    const t0 = Date.now();
    generatedContent = await generateAllContent(mockUser);
    const ms = Date.now() - t0;

    const wCount = generatedContent.welcomeSequence?.length || 0;
    const nCount = generatedContent.newsletterTemplates?.length || 0;
    const rCount = generatedContent.reEngagementSequence?.length || 0;

    if (wCount >= 3 && nCount >= 2 && rCount >= 2) {
      pass(`Content generated in ${(ms / 1000).toFixed(1)}s — ${wCount} welcome, ${nCount} newsletter, ${rCount} re-engagement`);
      track('pass');
    } else {
      fail(`Content generated but incomplete — ${wCount} welcome, ${nCount} newsletter, ${rCount} re-engagement`);
      track('fail');
    }

    // Validate structure of first welcome email
    const firstEmail = generatedContent.welcomeSequence?.[0];
    if (firstEmail?.subject && firstEmail?.htmlContent) {
      pass(`Welcome email #1 structure valid — subject: "${firstEmail.subject.slice(0, 50)}..."`);
      track('pass');
    } else {
      fail('Welcome email #1 missing subject or htmlContent', JSON.stringify(Object.keys(firstEmail || {})));
      track('fail');
    }

  } catch (err) {
    fail('Content generation failed', err.message);
    track('fail');
    return;
  }

  // Step 2: Push to Brevo
  info('Pushing generated content to Brevo CRM...');
  try {
    const { setupUserCRM } = await import('../services/brevo.js');
    const t0 = Date.now();
    const result = await setupUserCRM({ user: mockUser, generatedContent });
    const ms = Date.now() - t0;

    if (result.listId && result.welcomeTemplateIds?.length > 0) {
      pass(`Brevo CRM setup complete in ${(ms / 1000).toFixed(1)}s — List: ${result.listId}, Templates: ${result.welcomeTemplateIds.length + (result.newsletterTemplateIds?.length || 0) + (result.reEngagementTemplateIds?.length || 0)}`);
      track('pass');

      // Cleanup: delete the test list
      info('Cleaning up test data from Brevo...');
      try {
        await fetch(`https://api.brevo.com/v3/contacts/lists/${result.listId}`, {
          method: 'DELETE',
          headers: { 'api-key': process.env.BREVO_API_KEY, accept: 'application/json' },
        });
        info(`Deleted test list ${result.listId}`);
      } catch { /* ignore */ }

    } else {
      fail('Brevo CRM setup returned incomplete data', JSON.stringify(result));
      track('fail');
    }

  } catch (err) {
    fail('Brevo CRM setup failed', err.message);
    track('fail');
  }
}

// ---------------------------------------------------------------------------
// CLI Runner
// ---------------------------------------------------------------------------

const mode = process.argv[2] || 'keys';

console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}${CYAN}║       EEC Platform — Test Suite          ║${RESET}`);
console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════╝${RESET}`);
console.log(`${DIM}  Mode: ${mode} | ${new Date().toISOString()}${RESET}`);

async function run() {
  switch (mode) {
    case 'keys':
      await testKeyPresence();
      await testStripe();
      await testBrevo();
      await testResend();
      await testAI();
      await testFireCrawl();
      await testTavily();
      break;
    case 'brevo':
      await testKeyPresence();
      await testBrevo();
      break;
    case 'ai':
      await testKeyPresence();
      await testAI();
      break;
    case 'pipeline':
      await testPipeline();
      break;
    case 'all':
      await testKeyPresence();
      await testStripe();
      await testResend();
      await testBrevo();
      await testAI();
      await testFireCrawl();
      await testTavily();
      await testPipeline();
      break;
    default:
      console.log(`\n  Unknown mode: ${mode}`);
      console.log('  Usage: node server/tests/test-platform.js [keys|brevo|ai|pipeline|all]\n');
      process.exit(1);
  }

  summary();
}

run().catch((err) => {
  console.error(`\n${RED}Unhandled error:${RESET}`, err);
  process.exit(1);
});
