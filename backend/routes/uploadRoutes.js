// ============================================================
// WEATHERVERSE — Upload Routes
// ============================================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

// ── Initialize router ─────────────────────────────────────────
const router = express.Router();

// ── Ensure uploads directory exists ──────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('✅ Uploads directory created at:', UPLOAD_DIR);
}

// ── Multer configuration ──────────────────────────────────────
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

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter,
});

// ── Routes ──────────────────────────────────────────────────────

// ✅ POST /upload-pc - Upload from PC (Protected)
router.post('/upload-pc', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    
    // Get the full URL
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    
    console.log('✅ File uploaded:', req.file.filename);
    console.log('✅ URL:', fileUrl);
    
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

// ✅ POST /upload-multiple - Upload multiple files (Protected)
router.post('/upload-multiple', protect, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }
    
    const protocol = req.protocol;
    const host = req.get('host');
    
    const files = req.files.map(file => ({
      url: `${protocol}://${host}/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      name: file.originalname,
      filename: file.filename,
      size: file.size
    }));
    
    console.log(`✅ ${files.length} files uploaded`);
    
    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ POST /upload-url - Upload by URL (Protected)
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

// ✅ DELETE /upload/:publicId - Delete file (Protected)
router.delete('/upload/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ success: false, error: 'Public ID is required' });
    }
    
    // For local uploads, we delete the file from the uploads folder
    const filePath = path.join(UPLOAD_DIR, publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ File deleted: ${publicId}`);
      return res.json({ success: true, message: 'File deleted successfully' });
    }
    
    res.status(404).json({ success: false, error: 'File not found' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── Export ──────────────────────────────────────────────────────
module.exports = router;