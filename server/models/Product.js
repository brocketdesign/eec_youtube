import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true }, // amount in cents
  currency: { type: String, default: 'usd', lowercase: true },
  features: [{ type: String }],
  active: { type: Boolean, default: true },
  popular: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },

  // Stripe references — filled when synced
  stripeProductId: { type: String },
  stripePriceId: { type: String },

  // Metadata passed to Stripe
  metadata: { type: Map, of: String },
}, { timestamps: true });

productSchema.index({ active: 1, sortOrder: 1 });

export default mongoose.model('Product', productSchema);
