// ============================================================
// WEATHERVERSE — Story Model
// ============================================================

const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  type: {
    type: String,
    enum: ['text', 'video'],
    default: 'text',
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  thumbnailPublicId: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Weather Alert',
    enum: ['Weather Alert', 'Forecast', 'Local News', 'Climate', 'Emergency'],
  },
  author: {
    type: String,
    default: 'Admin',
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

// Indexes
StorySchema.index({ category: 1 });
StorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Story', StorySchema);