/**
 * AI Service — Multi-provider abstraction for content generation.
 * Supports Claude via Segmind, GPT-4o (OpenAI), and Grok (xAI via OpenAI-compatible API).
 */

import OpenAI from 'openai';

// ---------------------------------------------------------------------------
// Provider initialization (lazy — only when keys are available)
// ---------------------------------------------------------------------------

const SEGMIND_URL = 'https://api.segmind.com/v1/claude-4.5-sonnet';

let openaiClient = null;
let grokClient = null;

function hasSegmind() {
  return !!process.env.SEGMIND_API_KEY;
}

function getOpenAI() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function getGrok() {
  if (!grokClient && process.env.GROK_API_KEY) {
    grokClient = new OpenAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
  }
  return grokClient;
}

// ---------------------------------------------------------------------------
// Unified completion
// ---------------------------------------------------------------------------

async function complete(systemPrompt, userPrompt, { provider = 'auto', temperature = 0.7, maxTokens = 4096 } = {}) {
  // Auto-select: prefer Segmind (Claude) → OpenAI → Grok
  if (provider === 'auto') {
    if (hasSegmind()) provider = 'claude';
    else if (getOpenAI()) provider = 'openai';
    else if (getGrok()) provider = 'grok';
    else throw new Error('No AI provider configured. Set SEGMIND_API_KEY, OPENAI_API_KEY, or GROK_API_KEY.');
  }

  if (provider === 'claude') {
    if (!hasSegmind()) throw new Error('SEGMIND_API_KEY not set');
    const res = await fetch(SEGMIND_URL, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.SEGMIND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instruction: systemPrompt,
        messages: [{ role: 'user', content: [{ type: 'text', text: userPrompt }] }],
        max_tokens: maxTokens,
        temperature,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Segmind API ${res.status}: ${err.error || err.message || JSON.stringify(err)}`);
    }
    const data = await res.json();
    // Segmind returns Anthropic-style response
    return data.content?.[0]?.text || data.text || JSON.stringify(data);
  }

  if (provider === 'openai') {
    const client = getOpenAI();
    if (!client) throw new Error('OPENAI_API_KEY not set');
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    return response.choices[0].message.content;
  }

  if (provider === 'grok') {
    const client = getGrok();
    if (!client) throw new Error('GROK_API_KEY not set');
    const response = await client.chat.completions.create({
      model: 'grok-3',
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    return response.choices[0].message.content;
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}

// ---------------------------------------------------------------------------
// JSON completion helper — parses response as JSON
// ---------------------------------------------------------------------------

async function completeJSON(systemPrompt, userPrompt, options = {}) {
  const enrichedSystem = systemPrompt + '\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no code blocks, no explanation — just pure JSON.';
  const raw = await complete(enrichedSystem, userPrompt, options);

  // Strip possible markdown code fences
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

export { complete, completeJSON };
