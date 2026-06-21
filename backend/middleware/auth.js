const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized — no token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id)
      .select('-password -refreshToken');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized — invalid admin' 
      });
    }
    
    // Check if token was issued before last password change
    // You can add this check if you store passwordChangedAt field
    
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired',
        expired: true 
      });
    }
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized — invalid token' 
    });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Super admin only.' 
    });
  }
  next();
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.admin.role === 'superadmin' || req.admin.permissions?.[permission]) {
      return next();
    }
    return res.status(403).json({ 
      success: false,
      error: `Access denied. Missing ${permission} permission.` 
    });
  };
};

module.exports = { protect, requireSuperAdmin, checkPermission };