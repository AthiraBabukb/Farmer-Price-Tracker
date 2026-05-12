const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    market: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    recordedDate: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceHistory', priceHistorySchema);