const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    // Which farmer set this alert
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Which crop to watch
    crop: {
      type: String,
      required: true,
      trim: true
    },

    // Which market to watch
    market: {
      type: String,
      required: true,
      trim: true
    },

    // Alert when price goes above this value
    targetPrice: {
      type: Number,
      required: true
    },

    // Has this alert been triggered?
    isTriggered: {
      type: Boolean,
      default: false
    },

    // Is this alert still active?
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Alert', alertSchema);