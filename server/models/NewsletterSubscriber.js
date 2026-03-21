import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  channelUrl: {
    type: String,
    trim: true,
    default: '',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

newsletterSubscriberSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
