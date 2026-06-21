const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['text', 'video'], default: 'text' },
  content: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  category: { type: String, default: 'Weather Alert' },
  author: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);