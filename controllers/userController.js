import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = new User({
    username,
    email,
    password,
    role: role || 'service_engineer',
    status: 'inactive',
    createdBy: req.user.id,
  });

  await user.save();

  await Activity.create({
    userId: req.user.id,
    username: req.user.username,
    email: req.user.email,
    action: 'user_created',
  });

  res.status(201).json({
    message: 'User created successfully (Inactive)',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    total: users.length,
    users,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'active' },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await Activity.create({
    userId: req.user.id,
    username: req.user.username,
    email: req.user.email,
    action: 'user_activated',
  });

  res.status(200).json({
    message: 'User activated successfully',
    user,
  });
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'inactive' },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await Activity.create({
    userId: req.user.id,
    username: req.user.username,
    email: req.user.email,
    action: 'user_deactivated',
  });

  res.status(200).json({
    message: 'User deactivated successfully',
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await Activity.create({
    userId: req.user.id,
    username: req.user.username,
    email: req.user.email,
    action: 'user_deleted',
  });

  res.status(200).json({
    message: 'User deleted successfully',
  });
});
