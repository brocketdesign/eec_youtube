/**
 * Brevo CRM Service — manages contacts, lists, email templates, and automation
 * for each user's EEC setup.
 *
 * Uses the Brevo REST API v3 directly via fetch for reliability
 * (the @getbrevo/brevo SDK has quirks with ESM).
 */

const BREVO_BASE = 'https://api.brevo.com/v3';

function getApiKey() {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error('BREVO_API_KEY not set');
  return key;
}

async function brevoFetch(path, options = {}) {
  const res = await fetch(`${BREVO_BASE}${path}`, {
    ...options,
    headers: {
      'api-key': getApiKey(),
      'Content-Type': 'application/json',
      accept: 'application/json',
      ...options.headers,
    },
  });

  // Some Brevo endpoints return 204 with no body
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.message || data?.error || `Brevo API ${res.status}`;
    throw new Error(`Brevo error: ${msg}`);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Contacts & Lists
// ---------------------------------------------------------------------------

/** Create a list for this user's subscribers */
async function createList(listName, folderId = 1) {
  return brevoFetch('/contacts/lists', {
    method: 'POST',
    body: JSON.stringify({ name: listName, folderId }),
  });
}

/** Create or update a contact */
async function createContact(email, attributes = {}, listIds = []) {
  return brevoFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      email,
      attributes,
      listIds,
      updateEnabled: true,
    }),
  });
}

// ---------------------------------------------------------------------------
// Email Templates
// ---------------------------------------------------------------------------

/** Create an email template in Brevo */
async function createEmailTemplate({ name, subject, htmlContent, sender }) {
  const defaultSender = sender || await getDefaultSender();
  return brevoFetch('/smtp/templates', {
    method: 'POST',
    body: JSON.stringify({
      tag: 'eec-auto',
      sender: defaultSender,
      templateName: name,
      subject,
      htmlContent,
      isActive: true,
    }),
  });
}

/** Get a template by ID */
async function getTemplate(templateId) {
  return brevoFetch(`/smtp/templates/${templateId}`);
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

/** Create an email campaign (newsletter) */
async function createCampaign({ name, subject, htmlContent, listIds, sender, scheduledAt }) {
  const defaultSender = sender || await getDefaultSender();
  const body = {
    tag: 'eec-auto',
    sender: defaultSender,
    name,
    subject,
    htmlContent,
    recipients: { listIds },
  };
  if (scheduledAt) body.scheduledAt = scheduledAt;

  return brevoFetch('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Transactional Emails (for welcome sequences, etc.)
// ---------------------------------------------------------------------------

/** Send a transactional email */
async function sendTransactionalEmail({ to, subject, htmlContent, sender, tags = [] }) {
  const defaultSender = sender || await getDefaultSender();
  return brevoFetch('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: defaultSender,
      to: [{ email: to }],
      subject,
      htmlContent,
      tags,
    }),
  });
}

// ---------------------------------------------------------------------------
// Account info
// ---------------------------------------------------------------------------

/** Get Brevo account info (useful for verifying API key) */
async function getAccount() {
  return brevoFetch('/account');
}

/** Get verified senders */
async function getSenders() {
  return brevoFetch('/senders');
}

/** Get the first valid sender, or fall back to env/default */
async function getDefaultSender() {
  try {
    const data = await getSenders();
    const active = data?.senders?.find(s => s.active);
    if (active) return { name: active.name, email: active.email };
  } catch { /* fall through */ }
  return { name: 'EEC', email: process.env.BREVO_SENDER_EMAIL || 'noreply@eec.com' };
}

// ---------------------------------------------------------------------------
// Full setup: creates list + templates + initial automation for a user
// ---------------------------------------------------------------------------

async function setupUserCRM({ user, generatedContent }) {
  const brandName = user.onboarding.brandName || user.onboarding.channelName || user.name;

  // 1. Create a subscriber list for this user
  const list = await createList(`${brandName} — Subscribers`);
  const listId = list.id;

  // 2. Create the user as a contact (they're also a subscriber to manage)
  await createContact(user.email, {
    FIRSTNAME: user.name.split(' ')[0],
    LASTNAME: user.name.split(' ').slice(1).join(' '),
    EEC_BRAND: brandName,
  }, [listId]);

  // 3. Create welcome sequence templates
  const welcomeTemplateIds = [];
  for (const [i, email] of generatedContent.welcomeSequence.entries()) {
    const template = await createEmailTemplate({
      name: `${brandName} — Welcome ${i + 1}: ${email.subject}`,
      subject: email.subject,
      htmlContent: wrapInTemplate(email.body, brandName, user.onboarding.brandColors),
    });
    welcomeTemplateIds.push(template.id);
  }

  // 4. Create newsletter templates
  const newsletterTemplateIds = [];
  for (const tpl of generatedContent.newsletterTemplates) {
    const template = await createEmailTemplate({
      name: `${brandName} — Newsletter: ${tpl.name}`,
      subject: tpl.subject,
      htmlContent: wrapInTemplate(tpl.body, brandName, user.onboarding.brandColors),
    });
    newsletterTemplateIds.push(template.id);
  }

  // 5. Create re-engagement sequence templates
  const reEngagementTemplateIds = [];
  for (const [i, email] of generatedContent.reEngagementSequence.entries()) {
    const template = await createEmailTemplate({
      name: `${brandName} — ReEngage ${i + 1}: ${email.subject}`,
      subject: email.subject,
      htmlContent: wrapInTemplate(email.body, brandName, user.onboarding.brandColors),
    });
    reEngagementTemplateIds.push(template.id);
  }

  return {
    listId,
    welcomeTemplateIds,
    newsletterTemplateIds,
    reEngagementTemplateIds,
    loginUrl: 'https://app.brevo.com/login',
  };
}

// ---------------------------------------------------------------------------
// HTML wrapper — brands the email content
// ---------------------------------------------------------------------------

function wrapInTemplate(bodyHtml, brandName, colors = {}) {
  const primary = colors?.primary || '#00ff88';
  const bg = '#0a0a0a';
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${bg};color:#ffffff;padding:40px;">
    <div style="text-align:center;margin-bottom:30px;">
      <div style="display:inline-block;padding:8px 24px;background:linear-gradient(135deg,${primary},#00d4aa);border-radius:8px;font-weight:bold;font-size:18px;color:${bg};">${brandName}</div>
    </div>
    <div style="line-height:1.7;font-size:16px;color:#e0e0e0;">
      ${bodyHtml}
    </div>
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #333;text-align:center;">
      <p style="color:#666;font-size:12px;">&copy; ${brandName} — Powered by EEC</p>
      <p style="color:#666;font-size:11px;"><a href="{{unsubscribe}}" style="color:#666;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

export {
  createList,
  createContact,
  createEmailTemplate,
  getTemplate,
  createCampaign,
  sendTransactionalEmail,
  getAccount,
  getSenders,
  getDefaultSender,
  setupUserCRM,
};
