import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  name: { type: String, required: true, trim: true },

  // Onboarding data
  onboarding: {
    channelUrl: { type: String, trim: true },
    channelName: { type: String, trim: true },
    subscriberCount: { type: String, trim: true },
    niche: { type: String, trim: true },
    brandName: { type: String, trim: true },
    brandColors: { primary: String, secondary: String },
    toneOfVoice: { type: String, trim: true },
    targetAudience: { type: String, trim: true },
    audienceInterests: [String],
    goals: [String],
    emailFrequency: { type: String, trim: true },
    contentTopics: [String],
    leadMagnetIdea: { type: String, trim: true },
  },

  // Payment
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  stripeCustomerId: { type: String },
  stripeSessionId: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paidAt: { type: Date },

  // Setup pipeline status
  setupStatus: {
    type: String,
    enum: ['onboarding', 'payment_pending', 'processing', 'generating_content', 'setting_up_crm', 'complete', 'failed'],
    default: 'onboarding',
  },
  setupError: { type: String },
  setupCompletedAt: { type: Date },

  // Brevo CRM integration
  brevo: {
    listId: { type: Number },
    templateIds: {
      welcome: [Number],
      newsletter: [Number],
      reEngagement: [Number],
    },
  },

  // Generated content
  generatedContent: {
    welcomeSequence: [{ subject: String, preheader: String, htmlContent: String, order: Number }],
    newsletterTemplates: [{ name: String, subject: String, preheader: String, htmlContent: String }],
    reEngagementSequence: [{ subject: String, preheader: String, htmlContent: String, order: Number, delayDays: Number }],
    generatedAt: { type: Date },
  },

  // Stats
  stats: {
    totalContacts: { type: Number, default: 0 },
    emailsSent: { type: Number, default: 0 },
    openRate: { type: Number, default: 0 },
    clickRate: { type: Number, default: 0 },
    lastSynced: { type: Date },
  },

  // Custom domain
  customDomain: {
    domain: { type: String },
    verified: { type: Boolean, default: false },
  },
}, { timestamps: true });

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.index({ setupStatus: 1 });
userSchema.index({ stripeSessionId: 1 });

export default mongoose.model('User', userSchema);
