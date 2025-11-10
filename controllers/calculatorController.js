import Password from '../models/Password.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const calculateACDPassword = (dateTime, type) => {
  const date = new Date(dateTime);
  
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const min = date.getMinutes();

  let password = '';

  if (type === 'bypass') {
    // ACD Bypass Password: (yyyy+mm+dd)*(hh+mm)
    const datePart = yyyy + mm + dd;
    const timePart = hh + min;
    const result = datePart * timePart;
    password = String(result).slice(-4);
  } else if (type === 'menu') {
    // ACD Menu Password: (yyyy+mm+dd+hh+mm)*10-hh+dd
    const allParts = yyyy + mm + dd + hh + min;
    const result = (allParts * 10) - hh + dd;
    password = String(result).slice(-4);
  }

  return password;
};

export const calculatePassword = asyncHandler(async (req, res) => {
  const { dateTime, passwordType } = req.body;

  if (!dateTime || !passwordType) {
    return res.status(400).json({ error: 'DateTime and passwordType are required' });
  }

  if (!['bypass', 'menu'].includes(passwordType)) {
    return res.status(400).json({ error: 'Invalid password type' });
  }

  try {
    const fullPassword = calculateACDPassword(dateTime, passwordType);
    const lastFourDigits = fullPassword.slice(-4);

    const passwordRecord = new Password({
      userId: req.user.id,
      username: req.user.username,
      dateTime: new Date(dateTime),
      passwordType,
      fullPassword,
      lastFourDigits,
    });

    await passwordRecord.save();

    res.status(200).json({
      message: 'Password calculated successfully',
      passwordType: passwordType.toUpperCase(),
      lastFourDigits: `*${lastFourDigits}`,
    });
  } catch (error) {
    console.error('Password calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate password' });
  }
});

export const getPasswordHistory = asyncHandler(async (req, res) => {
  const passwords = await Password.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    total: passwords.length,
    passwords: passwords.map(p => ({
      ...p.toObject(),
      lastFourDigits: `*${p.lastFourDigits}`,
    })),
  });
});
