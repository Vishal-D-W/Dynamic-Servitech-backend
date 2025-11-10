import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['login', 'logout', 'user_created', 'user_deleted', 'user_activated', 'user_deactivated'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: false }
);

activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ email: 1, timestamp: -1 });

export default mongoose.model('Activity', activitySchema);
