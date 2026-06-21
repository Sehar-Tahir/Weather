// routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/contentController');

// Public routes (no authentication needed for reading)
router.get('/stories', getStories);
router.get('/stories/:id', getStory);
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlog);

// Protected routes (require authentication)
router.post('/stories', protect, createStory);
router.put('/stories/:id', protect, updateStory);
router.delete('/stories/:id', protect, deleteStory);
router.post('/blogs', protect, createBlog);
router.put('/blogs/:id', protect, updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);

module.exports = router;