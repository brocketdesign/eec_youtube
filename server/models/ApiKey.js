import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Store a prefix (first 8 chars) for display, and the full hashed key for auth
  keyHash: {
    type: String,
    required: true,
    unique: true,
  },
  keyPrefix: {
    type: String,
    required: true,
  },
  lastUsedAt: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Generate a new API key — returns the raw key (shown once) and the doc
apiKeySchema.statics.generateKey = async function (name) {
  const rawKey = `eec_${crypto.randomBytes(32).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const keyPrefix = rawKey.slice(0, 12);

  const doc = await this.create({ name, keyHash, keyPrefix });
  return { rawKey, doc };
};

// Find by raw key
apiKeySchema.statics.findByKey = async function (rawKey) {
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return this.findOne({ keyHash, isActive: true });
};

apiKeySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.keyHash;
    return ret;
  },
});

export default mongoose.model('ApiKey', apiKeySchema);
