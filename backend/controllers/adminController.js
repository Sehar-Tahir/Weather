const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_change_me';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

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

// Super Admin Login with enhanced security
const superAdminLogin = async (req, res) => {
  try {
    console.log('🔐 Super admin login attempt:', req.body.email);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin || admin.role !== 'superadmin') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for security
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (admin.isLocked) {
      const remaining = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(401).json({ 
        success: false, 
        error: `Account locked. Try again in ${remaining} minutes.` 
      });
    }
    
    if (!admin.isActive) {
      return res.status(401).json({ success: false, error: 'Account is deactivated' });
    }
    
    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Reset login attempts on success
    await admin.resetLoginAttempts();
    admin.lastLogin = new Date();
    await admin.save();
    
    const { accessToken, refreshToken } = generateTokens(admin);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        profileImage: admin.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token required' });
    }
    
    const admin = await Admin.findOne({ refreshToken });
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
    
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(admin);
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    if (req.admin) {
      await Admin.findByIdAndUpdate(req.admin._id, { refreshToken: null });
    }
    
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Regular Admin Login
const adminLogin = async (req, res) => {
  try {
    console.log('🔐 Admin login attempt:', req.body.email);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    if (admin.isLocked) {
      const remaining = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(401).json({ 
        success: false, 
        error: `Account locked. Try again in ${remaining} minutes.` 
      });
    }
    
    if (!admin.isActive) {
      return res.status(401).json({ success: false, error: 'Account is deactivated' });
    }
    
    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    await admin.resetLoginAttempts();
    admin.lastLogin = new Date();
    await admin.save();
    
    const { accessToken, refreshToken } = generateTokens(admin);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        profileImage: admin.profileImage
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Create new admin (superadmin only)
const createAdmin = async (req, res) => {
  try {
    const { email, name, password, permissions, role = 'admin' } = req.body;
    
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: 'Admin already exists' });
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
        manageSettings: false
      },
      createdBy: req.admin._id
    });
    
    await newAdmin.save();
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        permissions: newAdmin.permissions,
        isActive: newAdmin.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password -refreshToken')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single admin
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .select('-password -refreshToken');
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { name, permissions, isActive, role, profileImage } = req.body;
    
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    if (name) admin.name = name;
    if (permissions) admin.permissions = permissions;
    if (typeof isActive !== 'undefined') admin.isActive = isActive;
    if (role && req.admin.role === 'superadmin') admin.role = role;
    if (profileImage) admin.profileImage = profileImage;
    
    await admin.save();
    
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
        profileImage: admin.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    if (admin.role === 'superadmin') {
      return res.status(403).json({ success: false, error: 'Cannot delete super admin' });
    }
    
    await admin.deleteOne();
    
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    
    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get current admin profile
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id)
      .select('-password -refreshToken');
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Seed Super Admin
const seedSuperAdmin = async (req, res) => {
  try {
    const existingSuper = await Admin.findOne({ role: 'superadmin' });
    
    if (!existingSuper) {
      const superAdmin = new Admin({
        email: 'samaiqatanvir@gmail.com',
        password: 'samaiqa321',
        name: 'Samai Qatanvir',
        role: 'superadmin',
        permissions: {
          stories: true,
          blogs: true,
          media: true,
          manageAdmins: true,
          manageSettings: true
        }
      });
      
      await superAdmin.save();
      
      res.json({ 
        success: true, 
        message: 'Super admin created: samaiqatanvir@gmail.com / samaiqa321' 
      });
    } else {
      res.json({ success: true, message: 'Super admin already exists' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export all functions
module.exports = {
  superAdminLogin,
  adminLogin,
  refreshToken,
  logout,
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
  getMe,
  seedSuperAdmin
};