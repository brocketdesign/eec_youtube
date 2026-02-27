import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
    unique: true,            // one booking per slot
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  date: {                    // denormalized for easier queries
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  contactedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

bookingSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.slotId = ret.slot?.toString?.() ?? ret.slot;
    delete ret._id;
    delete ret.__v;
    delete ret.slot;
    return ret;
  },
});

export default mongoose.model('Booking', bookingSchema);
