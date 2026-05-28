import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (!token) { res.status(401); throw new Error('Not authorized, no token'); }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user) { res.status(401); throw new Error('User not found'); }
  next();
});

// Attaches req.user if a valid token is present, but does NOT block the
// request if there is no token. Used for routes that support both
// logged-in users and guests (e.g. placing an order).
export const optionalProtect = async (req, _res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (_) {
    // Invalid token — treat as guest, don't block
  }
  next();
};

export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403); throw new Error('Admin access required');
};
