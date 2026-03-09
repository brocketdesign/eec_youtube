/**
 * Onboarding & Payment Routes
 * Handles the full flow: questionnaire → Stripe payment → automated setup
 */

import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { runSetupPipeline } from '../services/setupPipeline.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Stripe setup
// ---------------------------------------------------------------------------

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Default fallback — used only when no product is specified
const DEFAULT_PRICE_AMOUNT = 50000; // $500.00 in cents
const DEFAULT_CURRENCY = 'usd';

// ---------------------------------------------------------------------------
// POST /api/onboarding — Save onboarding questionnaire answers
// ---------------------------------------------------------------------------

router.post('/onboarding', async (req, res) => {
  try {
    const { email, name, onboarding } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!onboarding?.channelUrl) {
      return res.status(400).json({ error: 'Channel URL is required' });
    }

    // Create or update user with onboarding data
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user && user.paymentStatus === 'paid') {
      return res.status(409).json({ error: 'An account with this email is already set up' });
    }

    if (user) {
      user.name = name;
      user.onboarding = onboarding;
      user.setupStatus = 'payment_pending';
      await user.save();
    } else {
      user = await User.create({
        email: email.toLowerCase(),
        name,
        onboarding,
        setupStatus: 'payment_pending',
      });
    }

    res.json({ success: true, userId: user._id.toString() });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Failed to save onboarding data' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/checkout — Create Stripe Checkout session
// ---------------------------------------------------------------------------

router.post('/checkout', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.paymentStatus === 'paid') {
      return res.status(409).json({ error: 'Already paid' });
    }

    const stripe = getStripe();
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    // Create Stripe customer if not exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Resolve product — use dynamic product if provided, else fallback
    let lineItems;
    if (productId) {
      const product = await Product.findById(productId);
      if (!product || !product.active) {
        return res.status(400).json({ error: 'Product not found or inactive' });
      }

      if (product.stripePriceId) {
        // Use pre-synced Stripe price
        lineItems = [{ price: product.stripePriceId, quantity: 1 }];
      } else {
        // Inline price_data as fallback
        lineItems = [{
          price_data: {
            currency: product.currency,
            product_data: { name: product.name, description: product.description || undefined },
            unit_amount: product.price,
          },
          quantity: 1,
        }];
      }

      user.productId = product._id;
    } else {
      // Legacy fallback — hardcoded product
      lineItems = [{
        price_data: {
          currency: DEFAULT_CURRENCY,
          product_data: {
            name: 'EEC — Automated Email System Setup',
            description: 'Full email marketing system: welcome sequence, newsletter templates, re-engagement campaign, and CRM setup — all powered by AI.',
          },
          unit_amount: DEFAULT_PRICE_AMOUNT,
        },
        quantity: 1,
      }];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/setup-progress?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/onboarding?step=payment&cancelled=true`,
      metadata: { userId: user._id.toString() },
    });

    user.stripeSessionId = session.id;
    await user.save();

    res.json({ sessionUrl: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/webhook/stripe — Stripe webhook handler
// ---------------------------------------------------------------------------

router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Dev mode — parse directly (not recommended for production)
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user && user.paymentStatus !== 'paid') {
          user.paymentStatus = 'paid';
          user.paidAt = new Date();
          user.setupStatus = 'processing';
          await user.save();
          console.log(`💰 Payment received for ${user.email}`);

          // Trigger async setup pipeline
          runSetupPipeline(user._id).catch(err => {
            console.error(`Pipeline failed for ${user.email}:`, err);
          });
        }
      } catch (err) {
        console.error('Webhook processing error:', err);
      }
    }
  }

  res.json({ received: true });
});

// ---------------------------------------------------------------------------
// GET /api/setup-status/:sessionId — Check setup progress (polled by frontend)
// ---------------------------------------------------------------------------

router.get('/setup-status/:sessionId', async (req, res) => {
  try {
    const user = await User.findOne({ stripeSessionId: req.params.sessionId });
    if (!user) return res.status(404).json({ error: 'Session not found' });

    res.json({
      status: user.setupStatus,
      error: user.setupError || null,
      completedAt: user.setupCompletedAt || null,
      email: user.email,
      brandName: user.onboarding?.brandName || user.onboarding?.channelName || user.name,
    });
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/login — User login (email + password)
// ---------------------------------------------------------------------------

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/dashboard/:userId — Get dashboard data
// ---------------------------------------------------------------------------

router.get('/dashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: user.toSafeJSON(),
      templates: {
        welcome: user.generatedContent?.welcomeSequence || [],
        newsletter: user.generatedContent?.newsletterTemplates || [],
        reEngagement: user.generatedContent?.reEngagementSequence || [],
      },
      brevo: {
        listId: user.brevo?.listId,
        templateIds: user.brevo?.templateIds,
      },
      stats: user.stats,
      domain: user.customDomain,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/dashboard/:userId/domain — Update custom domain
// ---------------------------------------------------------------------------

router.put('/dashboard/:userId/domain', async (req, res) => {
  try {
    const { domain } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.customDomain = { domain, verified: false };
    await user.save();

    res.json({
      success: true,
      domain: user.customDomain,
      dnsInstructions: {
        message: 'Add the following DNS records to verify your domain:',
        records: [
          { type: 'TXT', name: `eec._domainkey.${domain}`, value: 'Contact support for DKIM key' },
          { type: 'TXT', name: domain, value: 'v=spf1 include:sendinblue.com ~all' },
        ],
      },
    });
  } catch (err) {
    console.error('Domain update error:', err);
    res.status(500).json({ error: 'Failed to update domain' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/dashboard/:userId/template — Update an email template
// ---------------------------------------------------------------------------

router.put('/dashboard/:userId/template', async (req, res) => {
  try {
    const { type, index, subject, htmlContent, preheader } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const typeMap = {
      welcome: 'welcomeSequence',
      newsletter: 'newsletterTemplates',
      reEngagement: 'reEngagementSequence',
    };

    const field = typeMap[type];
    if (!field || !user.generatedContent?.[field]?.[index]) {
      return res.status(400).json({ error: 'Invalid template type or index' });
    }

    if (subject) user.generatedContent[field][index].subject = subject;
    if (htmlContent) user.generatedContent[field][index].htmlContent = htmlContent;
    if (preheader) user.generatedContent[field][index].preheader = preheader;

    user.markModified('generatedContent');
    await user.save();

    res.json({ success: true, template: user.generatedContent[field][index] });
  } catch (err) {
    console.error('Template update error:', err);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

export default router;
