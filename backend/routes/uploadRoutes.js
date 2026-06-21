// routes/uploadRoutes.js - COMPLETE FIXED VERSION
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Ensure /uploads dir exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('✅ Uploads directory created at:', UPLOAD_DIR);
}

// Multer disk storage for PC uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

// File filter for images and videos
const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /^image\/|^video\//.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter,
});

// Local file upload (Protected)
router.post('/upload-pc', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    console.log('✅ File uploaded:', req.file.filename);
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        type: fileType,
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// URL upload (Protected)
router.post('/upload-url', protect, async (req, res) => {
  try {
    const { url, type } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }
    
    // Determine media type
    let mediaType = type;
    if (!mediaType) {
      const ext = path.extname(url).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        mediaType = 'image';
      } else if (['.mp4', '.webm', '.ogg', '.mov'].includes(ext)) {
        mediaType = 'video';
      } else {
        mediaType = 'link';
      }
    }
    
    console.log('✅ URL uploaded:', url);
    
    res.json({
      success: true,
      data: {
        url: url,
        type: mediaType,
        isExternal: true
      }
    });
  } catch (error) {
    console.error('URL upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;