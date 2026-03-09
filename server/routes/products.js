/**
 * Product Routes
 * Admin CRUD for products + public listing + dynamic Stripe checkout
 */

import express from 'express';
import Product from '../models/Product.js';
import Admin from '../models/Admin.js';
import { syncProductToStripe } from '../services/stripeProducts.js';

const router = express.Router();

// Admin auth middleware (same logic as server/index.js)
const adminAuth = async (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (!password) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(401).json({ error: 'No admin configured' });
    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Unauthorized' });
    req.admin = admin;
    next();
  } catch {
    res.status(500).json({ error: 'Auth error' });
  }
};

// ---------------------------------------------------------------------------
// PUBLIC — GET /api/products — List active products for pricing page
// ---------------------------------------------------------------------------

router.get('/products', async (_req, res) => {
  try {
    const products = await Product.find({ active: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    res.json(
      products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        features: p.features,
        popular: p.popular,
        sortOrder: p.sortOrder,
      })),
    );
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN — GET /api/admin/products — List ALL products (including inactive)
// ---------------------------------------------------------------------------

router.get('/admin/products', adminAuth, async (_req, res) => {
  try {
    const products = await Product.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
    res.json(
      products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        features: p.features,
        active: p.active,
        popular: p.popular,
        sortOrder: p.sortOrder,
        stripeProductId: p.stripeProductId,
        stripePriceId: p.stripePriceId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    );
  } catch (err) {
    console.error('Admin products list error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN — POST /api/admin/products — Create product & sync to Stripe
// ---------------------------------------------------------------------------

router.post('/admin/products', adminAuth, async (req, res) => {
  try {
    const { name, description, price, currency, features, active, popular, sortOrder, metadata } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: 'name and price are required' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number (in cents)' });
    }

    const product = await Product.create({
      name,
      description: description || '',
      price,
      currency: currency || 'usd',
      features: features || [],
      active: active !== false,
      popular: popular || false,
      sortOrder: sortOrder ?? 0,
      metadata: metadata || {},
    });

    // Sync to Stripe
    await syncProductToStripe(product);

    res.status(201).json({ success: true, product: formatProduct(product) });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN — PUT /api/admin/products/:id — Update product & re-sync Stripe
// ---------------------------------------------------------------------------

router.put('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const allowed = ['name', 'description', 'price', 'currency', 'features', 'active', 'popular', 'sortOrder', 'metadata'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    }

    if (typeof product.price !== 'number' || product.price < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number (in cents)' });
    }

    // Re-sync to Stripe
    await syncProductToStripe(product);

    res.json({ success: true, product: formatProduct(product) });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN — DELETE /api/admin/products/:id — Deactivate product (soft delete)
// ---------------------------------------------------------------------------

router.delete('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.active = false;
    await syncProductToStripe(product);

    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to deactivate product' });
  }
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatProduct(p) {
  return {
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    currency: p.currency,
    features: p.features,
    active: p.active,
    popular: p.popular,
    sortOrder: p.sortOrder,
    stripeProductId: p.stripeProductId,
    stripePriceId: p.stripePriceId,
  };
}

export default router;
