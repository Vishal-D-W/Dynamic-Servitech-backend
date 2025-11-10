import Activity from '../models/Activity.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;

  const activities = await Activity.find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Activity.countDocuments();

  res.status(200).json({
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    activities: activities.map(a => ({
      username: a.username,
      email: a.email,
      action: a.action,
      timestamp: a.timestamp,
    })),
  });
});

export const getUserActivityLogs = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ userId: req.user.id })
    .sort({ timestamp: -1 })
    .limit(100);

  res.status(200).json({
    total: activities.length,
    activities,
  });
});
