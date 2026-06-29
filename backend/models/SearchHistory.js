// ============================================================
// WEATHERVERSE — Search History Model
// ============================================================

const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  query: {
    type: String,
    required: [true, 'Query is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['city', 'zip', 'location'],
    default: 'city',
  },
  city: {
    type: String,
    default: '',
    trim: true,
  },
  country: {
    type: String,
    default: '',
    trim: true,
  },
  lat: {
    type: Number,
  },
  lon: {
    type: Number,
  },
  userId: {
    type: String,
    default: 'anonymous',
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
SearchHistorySchema.index({ city: 1 });
SearchHistorySchema.index({ createdAt: -1 });
SearchHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);