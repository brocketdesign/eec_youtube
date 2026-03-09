/**
 * Stripe Product Sync Service
 * Creates or updates Stripe products/prices to match local Product documents.
 */

import Stripe from 'stripe';
import Product from '../models/Product.js';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Ensure the given Product document has a matching Stripe product + price.
 * If the product already exists in Stripe, updates name/description/active.
 * If the price changed, creates a new price and archives the old one.
 * Saves updated Stripe IDs back to MongoDB.
 */
export async function syncProductToStripe(product) {
  const stripe = getStripe();

  // --- Product ---
  let stripeProduct;
  if (product.stripeProductId) {
    stripeProduct = await stripe.products.update(product.stripeProductId, {
      name: product.name,
      description: product.description || undefined,
      active: product.active,
      metadata: product.metadata ? Object.fromEntries(product.metadata) : {},
    });
  } else {
    stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description || undefined,
      active: product.active,
      metadata: {
        mongoProductId: product._id.toString(),
        ...(product.metadata ? Object.fromEntries(product.metadata) : {}),
      },
    });
    product.stripeProductId = stripeProduct.id;
  }

  // --- Price ---
  // Check if current Stripe price still matches. If not, create a new one.
  let needsNewPrice = !product.stripePriceId;

  if (product.stripePriceId) {
    const existingPrice = await stripe.prices.retrieve(product.stripePriceId);
    if (
      existingPrice.unit_amount !== product.price ||
      existingPrice.currency !== product.currency
    ) {
      // Archive old price
      await stripe.prices.update(product.stripePriceId, { active: false });
      needsNewPrice = true;
    }
  }

  if (needsNewPrice) {
    const newPrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.price,
      currency: product.currency,
    });
    product.stripePriceId = newPrice.id;
  }

  await product.save();
  return product;
}

/**
 * Sync ALL active products to Stripe.
 */
export async function syncAllProductsToStripe() {
  const products = await Product.find({});
  const results = [];
  for (const product of products) {
    const synced = await syncProductToStripe(product);
    results.push(synced);
  }
  return results;
}
