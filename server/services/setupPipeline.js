/**
 * Setup Pipeline — Orchestrates the full automated setup after payment:
 * 1. Generate AI content
 * 2. Push to Brevo CRM
 * 3. Send credentials to user
 */

import User from '../models/User.js';
import { generateAllContent } from './contentGenerator.js';
import { setupUserCRM, sendTransactionalEmail } from './brevo.js';

async function runSetupPipeline(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error(`User ${userId} not found`);

  console.log(`🚀 Starting setup pipeline for ${user.email}`);

  try {
    // Step 1: Generate content
    user.setupStatus = 'generating_content';
    await user.save();
    console.log(`📝 Generating content for ${user.email}...`);

    const content = await generateAllContent(user);
    user.generatedContent = content;
    await user.save();
    console.log(`✅ Content generated: ${content.welcomeSequence.length} welcome, ${content.newsletterTemplates.length} newsletter, ${content.reEngagementSequence.length} re-engagement`);

    // Step 2: Setup CRM
    user.setupStatus = 'setting_up_crm';
    await user.save();
    console.log(`🔧 Setting up Brevo CRM for ${user.email}...`);

    const crmResult = await setupUserCRM({ user, generatedContent: content });
    user.brevo = {
      listId: crmResult.listId,
      templateIds: {
        welcome: crmResult.welcomeTemplateIds,
        newsletter: crmResult.newsletterTemplateIds,
        reEngagement: crmResult.reEngagementTemplateIds,
      },
    };
    await user.save();
    console.log(`✅ CRM setup complete. List ID: ${crmResult.listId}`);

    // Step 3: Mark complete
    user.setupStatus = 'complete';
    user.setupCompletedAt = new Date();
    await user.save();

    // Step 4: Send welcome email with dashboard access
    const brandName = user.onboarding.brandName || user.onboarding.channelName || user.name;
    const dashboardUrl = `${process.env.SITE_URL || 'http://localhost:5173'}/dashboard`;

    try {
      await sendTransactionalEmail({
        to: user.email,
        subject: `🎉 Your EEC Email System is Ready — ${brandName}`,
        htmlContent: getSetupCompleteEmail(user, dashboardUrl),
        tags: ['eec-setup-complete'],
      });
      console.log(`📧 Setup complete email sent to ${user.email}`);
    } catch (emailErr) {
      console.error('Failed to send setup complete email:', emailErr.message);
    }

    console.log(`🎉 Full setup complete for ${user.email}`);
    return { success: true, user: user.toSafeJSON() };

  } catch (err) {
    console.error(`❌ Setup pipeline failed for ${user.email}:`, err);
    user.setupStatus = 'failed';
    user.setupError = err.message;
    await user.save();
    throw err;
  }
}

function getSetupCompleteEmail(user, dashboardUrl) {
  const brandName = user.onboarding.brandName || user.onboarding.channelName || user.name;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;padding:40px;">
    <div style="text-align:center;margin-bottom:30px;">
      <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#00ff88,#00d4aa);border-radius:12px;line-height:48px;font-weight:bold;font-size:22px;color:#0a0a0a;">E</div>
    </div>
    
    <h1 style="color:#00ff88;text-align:center;font-size:28px;margin-bottom:8px;">Your Email System is Live! 🎉</h1>
    <p style="color:#a0a0a0;text-align:center;font-size:16px;margin-bottom:30px;">Everything has been set up for <strong style="color:#fff;">${brandName}</strong></p>

    <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin-bottom:20px;">
      <p style="color:#00ff88;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">What's Been Created</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#a0a0a0;padding:8px 0;font-size:14px;">✅ Welcome Email Sequence</td><td style="color:#fff;padding:8px 0;font-size:14px;text-align:right;">${user.generatedContent?.welcomeSequence?.length || 5} emails</td></tr>
        <tr><td style="color:#a0a0a0;padding:8px 0;font-size:14px;">✅ Newsletter Templates</td><td style="color:#fff;padding:8px 0;font-size:14px;text-align:right;">${user.generatedContent?.newsletterTemplates?.length || 4} templates</td></tr>
        <tr><td style="color:#a0a0a0;padding:8px 0;font-size:14px;">✅ Re-engagement Campaign</td><td style="color:#fff;padding:8px 0;font-size:14px;text-align:right;">${user.generatedContent?.reEngagementSequence?.length || 3} emails</td></tr>
        <tr><td style="color:#a0a0a0;padding:8px 0;font-size:14px;">✅ Subscriber List</td><td style="color:#fff;padding:8px 0;font-size:14px;text-align:right;">Ready</td></tr>
      </table>
    </div>

    <div style="text-align:center;margin:30px 0;">
      <a href="${dashboardUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#00ff88,#00d4aa);color:#0a0a0a;font-weight:bold;font-size:16px;text-decoration:none;border-radius:8px;">Go to Your Dashboard</a>
    </div>

    <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin-bottom:20px;">
      <p style="color:#00ff88;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Next Steps</p>
      <ol style="color:#a0a0a0;font-size:14px;line-height:2;padding-left:20px;margin:0;">
        <li>Visit your dashboard to review your email templates</li>
        <li>Set up your custom domain for professional branding</li>
        <li>Add the signup form to your YouTube description</li>
        <li>Start growing your email list!</li>
      </ol>
    </div>

    <p style="color:#444;text-align:center;font-size:12px;margin-top:30px;">&copy; EEC — Email Engagement for Creators</p>
  </div>
</body>
</html>`;
}

export { runSetupPipeline };
