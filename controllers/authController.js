import User from '../models/User.js';
import Activity from '../models/Activity.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = new User({
    username,
    email,
    password,
    role: 'service_engineer',
    status: 'inactive',
  });

  await user.save();

  res.status(201).json({
    message: 'Account created successfully. Please wait for admin activation.',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.status === 'inactive') {
    return res.status(403).json({ error: 'Account inactive. Please wait for admin activation.' });
  }

  await Activity.create({
    userId: user._id,
    username: user.username,
    email: user.email,
    action: 'login',
    userAgent: req.headers['user-agent'],
  });

  const token = generateToken(user);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await Activity.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'logout',
      userAgent: req.headers['user-agent'],
    });
  }

  res.status(200).json({ message: 'Logout successful' });
});
