// ============================================================
// WEATHERVERSE — Search History Model (MongoDB / Mongoose)
// ============================================================

const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema(
  {
    query:   { type: String, required: true, trim: true },
    type:    { type: String, enum: ['city', 'zip', 'location'], default: 'city' },
    city:    { type: String, default: '' },
    country: { type: String, default: '' },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Index for faster queries by city name
SearchHistorySchema.index({ city: 1 });
SearchHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
