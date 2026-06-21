// controllers/uploadController.js
const path = require('path');

// Local upload handler
const uploadLocal = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.json({ 
    success: true, 
    data: { 
      url, 
      type, 
      name: req.file.originalname,
      filename: req.file.filename
    } 
  });
};

// Upload by URL/link
const uploadByUrl = async (req, res) => {
  try {
    const { url, type } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Determine type from URL if not provided
    let mediaType = type;
    if (!mediaType) {
      const ext = path.extname(url).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        mediaType = 'image';
      } else if (['.mp4', '.webm', '.ogg'].includes(ext)) {
        mediaType = 'video';
      } else {
        mediaType = 'link';
      }
    }
    
    res.json({ 
      success: true, 
      data: { 
        url, 
        type: mediaType,
        isExternal: true
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadLocal, uploadByUrl };