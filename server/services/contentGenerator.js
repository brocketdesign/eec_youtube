/**
 * Content Generation Pipeline — uses AI to generate full email marketing
 * content based on the user's onboarding data.
 */

import { completeJSON } from './ai.js';

// ---------------------------------------------------------------------------
// Channel analysis (uses FireCrawl if available, else AI inference)
// ---------------------------------------------------------------------------

async function analyzeChannel(channelUrl) {
  // Try FireCrawl if available
  if (process.env.FIRECRAWL_API_KEY) {
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({ url: channelUrl, formats: ['markdown'] }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data?.markdown || null;
      }
    } catch (err) {
      console.warn('FireCrawl failed, using AI inference:', err.message);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Web search for niche context
// ---------------------------------------------------------------------------

async function searchNicheContext(niche, channelName) {
  if (process.env.TAVILY_API_KEY) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: `${channelName} YouTube ${niche} email newsletter trends 2025 2026`,
          max_results: 5,
          search_depth: 'basic',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.results?.map(r => `${r.title}: ${r.content}`).join('\n\n') || null;
      }
    } catch (err) {
      console.warn('Tavily search failed:', err.message);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Generate all email content for a user
// ---------------------------------------------------------------------------

async function generateAllContent(user) {
  const { onboarding } = user;
  const channelData = await analyzeChannel(onboarding.channelUrl);
  const nicheContext = await searchNicheContext(onboarding.niche, onboarding.channelName);

  const contextBlock = [
    `Channel: ${onboarding.channelName || 'Unknown'}`,
    `YouTube URL: ${onboarding.channelUrl}`,
    `Niche: ${onboarding.niche}`,
    `Subscribers: ${onboarding.subscriberCount || 'Not specified'}`,
    `Brand Name: ${onboarding.brandName || onboarding.channelName}`,
    `Brand Colors: Primary ${onboarding.brandColors?.primary || '#00ff88'}, Secondary ${onboarding.brandColors?.secondary || '#0a0a0a'}`,
    `Tone of Voice: ${onboarding.toneOfVoice || 'friendly and authentic'}`,
    `Target Audience: ${onboarding.targetAudience || 'YouTube viewers'}`,
    `Audience Interests: ${(onboarding.audienceInterests || []).join(', ') || 'General'}`,
    `Goals: ${(onboarding.goals || []).join(', ')}`,
    `Email Frequency: ${onboarding.emailFrequency || 'weekly'}`,
    `Content Topics: ${(onboarding.contentTopics || []).join(', ')}`,
    `Lead Magnet Idea: ${onboarding.leadMagnetIdea || 'Not specified'}`,
    channelData ? `\nChannel Page Data:\n${channelData.slice(0, 3000)}` : '',
    nicheContext ? `\nNiche Research:\n${nicheContext.slice(0, 2000)}` : '',
  ].filter(Boolean).join('\n');

  // Generate welcome sequence, newsletter templates, and re-engagement in parallel
  const [welcomeSequence, newsletterTemplates, reEngagementSequence] = await Promise.all([
    generateWelcomeSequence(contextBlock),
    generateNewsletterTemplates(contextBlock),
    generateReEngagementSequence(contextBlock),
  ]);

  return {
    welcomeSequence,
    newsletterTemplates,
    reEngagementSequence,
    generatedAt: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Welcome Sequence (5 emails)
// ---------------------------------------------------------------------------

async function generateWelcomeSequence(context) {
  const system = `You are an expert email marketing copywriter specializing in YouTube creator brands.
Generate a 5-email welcome sequence for new subscribers. Each email should feel personal, valuable, and on-brand.

The emails should follow this structure:
1. Welcome & what to expect (immediate)
2. The creator's story & mission (day 1)
3. Best content roundup / value bomb (day 3)
4. Behind the scenes / exclusive insight (day 5)
5. Community invite & engagement (day 7)

Write actual email HTML content (using inline styles). Make it look professional with the creator's brand colors.
Use engaging subject lines with personality. Include clear CTAs.`;

  const result = await completeJSON(system, `Creator context:\n${context}\n\nGenerate the 5-email welcome sequence as JSON array with: subject, preheader, htmlContent, order (1-5)`);
  return Array.isArray(result) ? result : result.emails || result.welcomeSequence || [];
}

// ---------------------------------------------------------------------------
// Newsletter Templates (4 templates)
// ---------------------------------------------------------------------------

async function generateNewsletterTemplates(context) {
  const system = `You are an expert email marketing copywriter for YouTube creators.
Generate 4 reusable newsletter templates the creator can use for ongoing emails.

Template types:
1. "New Video Alert" — announce new uploads with compelling hooks
2. "Weekly Digest" — roundup of content, tips, and updates
3. "Behind The Scenes" — personal stories, process reveals
4. "Value Bomb" — educational deep-dive on a topic from their niche

Write actual email HTML content with inline styles. Use the brand colors. Include placeholder markers like {{VIDEO_TITLE}}, {{VIDEO_URL}}, {{TOPIC}}, {{TIP_1}}, etc.
Make them visually appealing and mobile-responsive.`;

  const result = await completeJSON(system, `Creator context:\n${context}\n\nGenerate 4 newsletter templates as JSON array with: name, subject, preheader, htmlContent`);
  return Array.isArray(result) ? result : result.templates || result.newsletterTemplates || [];
}

// ---------------------------------------------------------------------------
// Re-engagement Sequence (3 emails)
// ---------------------------------------------------------------------------

async function generateReEngagementSequence(context) {
  const system = `You are an expert email marketing copywriter specializing in re-engagement campaigns for YouTube creators.
Generate a 3-email re-engagement sequence for subscribers who haven't opened emails in 30+ days.

Email structure:
1. "We miss you" — gentle reminder of value, sent at day 30 of inactivity
2. "Here's what you missed" — highlight best recent content, day 37
3. "Last chance" — final attempt with exclusive offer/content, day 44

Write actual email HTML content with inline styles. Use the brand colors. Be genuine and non-pushy.
Include compelling subject lines designed to get opens from cold subscribers.`;

  const result = await completeJSON(system, `Creator context:\n${context}\n\nGenerate the 3-email re-engagement sequence as JSON array with: subject, preheader, htmlContent, order (1-3), delayDays (30, 37, 44)`);
  return Array.isArray(result) ? result : result.emails || result.reEngagementSequence || [];
}

export { generateAllContent, analyzeChannel, searchNicheContext };
