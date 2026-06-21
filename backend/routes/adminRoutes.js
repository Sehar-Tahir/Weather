const express = require('express');
const router = express.Router();
const { protect, requireSuperAdmin } = require('../middleware/auth');
const {
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
} = require('../controllers/adminController');

// Public routes
router.post('/login/super', superAdminLogin);
router.post('/login', adminLogin);
router.post('/refresh', refreshToken);
router.get('/seed', seedSuperAdmin);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/change-password', changePassword);
router.post('/logout', logout);

// Super admin only routes
router.post('/create', requireSuperAdmin, createAdmin);
router.get('/all', requireSuperAdmin, getAdmins);
router.get('/:id', requireSuperAdmin, getAdmin);
router.put('/:id', requireSuperAdmin, updateAdmin);
router.delete('/:id', requireSuperAdmin, deleteAdmin);

module.exports = router;