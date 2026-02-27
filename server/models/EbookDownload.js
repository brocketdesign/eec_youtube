import mongoose from 'mongoose';

const ebookDownloadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  downloadedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// One record per email — upsert to avoid duplicates
ebookDownloadSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('EbookDownload', ebookDownloadSchema);
