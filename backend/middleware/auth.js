// ============================================================
// WEATHERVERSE — Authentication Middleware
// ============================================================

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError('Not authorized — no token provided', 401));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id)
      .select('-password -refreshToken');

    if (!admin) {
      return next(new AppError('User no longer exists', 401));
    }

    if (!admin.isActive) {
      return next(new AppError('Account is deactivated', 401));
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    return next(new AppError('Not authorized', 401));
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'superadmin') {
    return next(new AppError('Access denied. Super admin only.', 403));
  }
  next();
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.admin.role === 'superadmin' || req.admin.permissions?.[permission]) {
      return next();
    }
    return next(new AppError(`Access denied. Missing ${permission} permission.`, 403));
  };
};

module.exports = { protect, requireSuperAdmin, checkPermission };