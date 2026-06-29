// ============================================================
// WEATHERVERSE — Upload Controller with Cloudinary
// ============================================================

const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// ── Upload single file to Cloudinary ──────────────────────
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path);

    // Delete local file after upload
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.warn('Could not delete local file:', err);
    }

    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        type: mediaType,
        name: req.file.originalname,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── Upload by URL ──────────────────────────────────────────
const uploadByUrl = async (req, res, next) => {
  try {
    const { url, type } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    // Upload to Cloudinary from URL
    const result = await uploadToCloudinary(url);

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        type: type || 'image',
      },
    });
  } catch (error) {
    console.error('URL upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── Delete file ────────────────────────────────────────────
const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ success: false, error: 'Public ID is required' });
    }

    await deleteFromCloudinary(publicId);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  uploadFile,
  uploadByUrl,
  deleteFile,
};