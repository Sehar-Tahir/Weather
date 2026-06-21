const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  category: { type: String, default: 'Climate Science' },
  author: { type: String, default: 'Admin' },
  readTime: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);