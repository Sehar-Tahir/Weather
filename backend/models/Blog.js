// ============================================================
// WEATHERVERSE — Blog Model
// ============================================================

const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  excerpt: {
    type: String,
    default: '',
    maxlength: [1000, 'Excerpt cannot exceed 1000 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  coverImage: {
    type: String,
    default: '',
  },
  coverImagePublicId: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Climate Science',
    enum: ['Climate Science', 'Guides', 'Environment', 'Technology', 'News', 'Analysis'],
  },
  author: {
    type: String,
    default: 'Admin',
  },
  readTime: {
    type: Number,
    default: 5,
    min: 1,
    max: 60,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
BlogSchema.index({ category: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ title: 'text' });

module.exports = mongoose.model('Blog', BlogSchema);