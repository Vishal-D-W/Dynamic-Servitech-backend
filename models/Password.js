import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: String,
    dateTime: {
      type: Date,
      required: true,
    },
    passwordType: {
      type: String,
      enum: ['bypass', 'menu'],
      required: true,
    },
    fullPassword: {
      type: String,
      required: true,
    },
    lastFourDigits: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Password', passwordSchema);
