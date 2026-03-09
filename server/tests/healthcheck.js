/**
 * EEC Quick Healthcheck — fast, no API calls, just checks env vars
 * Run: node server/tests/healthcheck.js
 */

import 'dotenv/config';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}EEC Platform — Quick Healthcheck${RESET}\n`);

const checks = [
  { env: 'MONGO_URI', label: 'MongoDB', required: true, category: 'Core' },
  { env: 'RESEND_API_KEY', label: 'Resend', required: true, category: 'Core' },
  { env: 'STRIPE_SECRET_KEY', label: 'Stripe', required: true, category: 'Payments' },
  { env: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook', required: false, category: 'Payments' },
  { env: 'BREVO_API_KEY', label: 'Brevo CRM', required: true, category: 'CRM' },
  { env: 'BREVO_SENDER_EMAIL', label: 'Brevo Sender', required: false, category: 'CRM' },
  { env: 'SEGMIND_API_KEY', label: 'Claude (Segmind)', required: false, category: 'AI' },
  { env: 'OPENAI_API_KEY', label: 'GPT-4o', required: false, category: 'AI' },
  { env: 'GROK_API_KEY', label: 'Grok', required: false, category: 'AI' },
  { env: 'FIRECRAWL_API_KEY', label: 'FireCrawl', required: false, category: 'Enrichment' },
  { env: 'TAVILY_API_KEY', label: 'Tavily', required: false, category: 'Enrichment' },
];

let currentCategory = '';
let ready = true;

for (const c of checks) {
  if (c.category !== currentCategory) {
    currentCategory = c.category;
    console.log(`  ${BOLD}${currentCategory}${RESET}`);
  }

  const val = process.env[c.env];
  const isSet = val && val.length > 3;
  const icon = isSet ? `${GREEN}●${RESET}` : c.required ? `${RED}●${RESET}` : `${YELLOW}○${RESET}`;
  const status = isSet ? 'configured' : c.required ? 'MISSING' : 'not set';
  const statusColor = isSet ? GREEN : c.required ? RED : YELLOW;

  console.log(`    ${icon} ${c.label.padEnd(18)} ${statusColor}${status}${RESET}  ${DIM}${c.env}${RESET}`);

  if (c.required && !isSet) ready = false;
}

// Check at least one AI key
const aiKeys = ['SEGMIND_API_KEY', 'OPENAI_API_KEY', 'GROK_API_KEY'];
const hasAI = aiKeys.some(k => process.env[k] && process.env[k].length > 3);
if (!hasAI) {
  console.log(`\n  ${RED}● Need at least one AI provider (Claude, GPT-4o, or Grok)${RESET}`);
  ready = false;
}

// Stripe mode check
if (process.env.STRIPE_SECRET_KEY) {
  const mode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE';
  const modeColor = mode === 'TEST' ? YELLOW : RED;
  console.log(`\n  ${BOLD}Stripe Mode:${RESET} ${modeColor}${mode}${RESET}`);
}

console.log(`\n  ${BOLD}Status:${RESET} ${ready ? `${GREEN}Ready to launch ✓${RESET}` : `${RED}Missing required keys ✗${RESET}`}`);
console.log(`\n  ${DIM}Run 'npm run test:keys' to verify API connections${RESET}\n`);

process.exit(ready ? 0 : 1);
