// ============================================================
// WEATHERVERSE — Admin Controller
// ============================================================

const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Generate tokens
const generateTokens = (admin) => {
  const accessToken = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = admin.generateRefreshToken();
  return { accessToken, refreshToken };
};

// Set cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ── Super Admin Login ───────────────────────────────────────
const superAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
      .select('+password +refreshToken');

    if (!admin || admin.role !== 'superadmin') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if account is locked
    if (admin.isLocked) {
      const remaining = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return next(new AppError(`Account locked. Try again in ${remaining} minutes.`, 401));
    }

    if (!admin.isActive) {
      return next(new AppError('Account is deactivated', 401));
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      await admin.incrementLoginAttempts();
      return next(new AppError('Invalid credentials', 401));
    }

    // Reset login attempts on success
    await admin.resetLoginAttempts();
    admin.lastLogin = new Date();
    await admin.save();

    const { accessToken, refreshToken } = generateTokens(admin);
    setTokenCookies(res, accessToken, refreshToken);

    logger.info(`Super admin logged in: ${admin.email}`);

    res.json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        profileImage: admin.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin Login ─────────────────────────────────────────────
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
      .select('+password +refreshToken');

    if (!admin) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return next(new AppError('Invalid credentials', 401));
    }

    if (admin.isLocked) {
      const remaining = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return next(new AppError(`Account locked. Try again in ${remaining} minutes.`, 401));
    }

    if (!admin.isActive) {
      return next(new AppError('Account is deactivated', 401));
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      await admin.incrementLoginAttempts();
      return next(new AppError('Invalid credentials', 401));
    }

    await admin.resetLoginAttempts();
    admin.lastLogin = new Date();
    await admin.save();

    const { accessToken, refreshToken } = generateTokens(admin);
    setTokenCookies(res, accessToken, refreshToken);

    logger.info(`Admin logged in: ${admin.email}`);

    res.json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        profileImage: admin.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Refresh Token ──────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return next(new AppError('Refresh token required', 401));
    }

    const admin = await Admin.findOne({ refreshToken })
      .select('+password');

    if (!admin || !admin.isActive) {
      return next(new AppError('Invalid refresh token', 401));
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(admin);
    setTokenCookies(res, accessToken, newRefreshToken);

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ── Logout ─────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    if (req.admin) {
      await Admin.findByIdAndUpdate(req.admin._id, { refreshToken: null });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// ── Get Current Admin ──────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id)
      .select('-password -refreshToken');
    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

// ── Create Admin (Super Admin only) ──────────────────────
const createAdmin = async (req, res, next) => {
  try {
    const { email, name, password, permissions, role = 'admin' } = req.body;

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return next(new AppError('Admin already exists', 400));
    }

    const newAdmin = new Admin({
      email: email.toLowerCase(),
      name,
      password,
      role,
      permissions: permissions || {
        stories: true,
        blogs: true,
        media: true,
        manageAdmins: false,
        manageSettings: false,
      },
      createdBy: req.admin._id,
    });

    await newAdmin.save();

    logger.info(`New admin created: ${newAdmin.email} by ${req.admin.email}`);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        permissions: newAdmin.permissions,
        isActive: newAdmin.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get All Admins ─────────────────────────────────────────
const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find()
      .select('-password -refreshToken')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Admin ──────────────────────────────────────
const getAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .select('-password -refreshToken');

    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

// ── Update Admin ──────────────────────────────────────────
const updateAdmin = async (req, res, next) => {
  try {
    const { name, permissions, isActive, role, profileImage } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    if (name) admin.name = name;
    if (permissions) admin.permissions = permissions;
    if (typeof isActive !== 'undefined') admin.isActive = isActive;
    if (role && req.admin.role === 'superadmin') admin.role = role;
    if (profileImage) admin.profileImage = profileImage;

    await admin.save();

    logger.info(`Admin updated: ${admin.email} by ${req.admin.email}`);

    res.json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        profileImage: admin.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Admin ──────────────────────────────────────────
const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return next(new AppError('Admin not found', 404));
    }

    if (admin.role === 'superadmin') {
      return next(new AppError('Cannot delete super admin', 403));
    }

    await admin.deleteOne();

    logger.info(`Admin deleted: ${admin.email} by ${req.admin.email}`);

    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ── Change Password ──────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select('+password');

    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      return next(new AppError('Current password is incorrect', 401));
    }

    admin.password = newPassword;
    await admin.save();

    logger.info(`Password changed for: ${admin.email}`);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// ── Seed Super Admin ──────────────────────────────────────
const seedSuperAdmin = async (req, res, next) => {
  try {
    const existingSuper = await Admin.findOne({ role: 'superadmin' });

    if (!existingSuper) {
      const superAdmin = new Admin({
        email: process.env.ADMIN_EMAIL || 'samaiqatanvir@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@2024Secure!',
        name: process.env.ADMIN_NAME || 'Samai Qatanvir',
        role: 'superadmin',
        permissions: {
          stories: true,
          blogs: true,
          media: true,
          manageAdmins: true,
          manageSettings: true,
        },
        isActive: true,
      });

      await superAdmin.save();
      logger.info('Super admin seeded successfully');

      res.json({
        success: true,
        message: 'Super admin created successfully',
        credentials: {
          email: superAdmin.email,
          password: process.env.ADMIN_PASSWORD || 'Admin@2024Secure!',
        },
      });
    } else {
      res.json({ success: true, message: 'Super admin already exists' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  superAdminLogin,
  adminLogin,
  refreshToken,
  logout,
  getMe,
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
  seedSuperAdmin,
};