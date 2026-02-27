import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: {
    type: String,       // 'YYYY-MM-DD'
    required: true,
    index: true,
  },
  time: {
    type: String,       // 'HH:mm' (24-hour)
    required: true,
  },
}, { timestamps: true });

// Prevent duplicate date+time pairs
slotSchema.index({ date: 1, time: 1 }, { unique: true });

// Virtual id field that maps _id → id for frontend consistency
slotSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Slot', slotSchema);
