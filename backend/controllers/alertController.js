const Alert = require('../models/Alert');
const axios = require('axios');
const nodemailer = require('nodemailer');

// ─────────────────────────────────────────
// CREATE ALERT
// Route: POST /api/alerts
// ─────────────────────────────────────────
const createAlert = async (req, res) => {
  try {
    const { crop, market, targetPrice } = req.body;

    // Check all fields provided
    if (!crop || !market || !targetPrice) {
      return res.status(400).json({
        message: 'Please provide crop, market and targetPrice'
      });
    }

    // Create alert in database
    const alert = await Alert.create({
      userId: req.user._id,
      crop,
      market,
      targetPrice
    });

    res.status(201).json({
      message: 'Alert created successfully',
      data: alert
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────
// GET MY ALERTS
// Route: GET /api/alerts
// ─────────────────────────────────────────
const getMyAlerts = async (req, res) => {
  try {
    // Find all alerts for logged in farmer
    const alerts = await Alert.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      message: 'Alerts fetched successfully',
      count: alerts.length,
      data: alerts
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────
// DELETE ALERT
// Route: DELETE /api/alerts/:id
// ─────────────────────────────────────────
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    // Check alert exists
    if (!alert) {
      return res.status(404).json({
        message: 'Alert not found'
      });
    }

    // Check alert belongs to logged in farmer
    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized to delete this alert'
      });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────
// CHECK ALERTS AND SEND EMAIL
// This runs every day via cron job
// ─────────────────────────────────────────
const checkAndNotifyAlerts = async () => {
  try {
    console.log('Checking alerts...');

    // Get all active alerts
    const alerts = await Alert.find({
      isActive: true,
      isTriggered: false
    }).populate('userId', 'name email');

    if (alerts.length === 0) {
      console.log('No active alerts to check');
      return;
    }

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Check each alert
    for (const alert of alerts) {
      try {
        // Fetch current price from Agmarknet
        const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=10&filters[commodity]=${encodeURIComponent(alert.crop)}&filters[market]=${encodeURIComponent(alert.market)}`;

        const response = await axios.get(apiUrl);
        const records = response.data.records;

        if (records && records.length > 0) {
          const currentPrice = records[0].modal_price;

          // Check if price crossed target
          if (currentPrice >= alert.targetPrice) {
            console.log(`Alert triggered for ${alert.crop} in ${alert.market}`);

            // Send email notification
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: alert.userId.email,
              subject: `Price Alert: ${alert.crop} price reached your target!`,
              html: `
                <h2>Price Alert Triggered!</h2>
                <p>Dear ${alert.userId.name},</p>
                <p>Good news! The price you were waiting for has been reached.</p>
                <table>
                  <tr><td>Crop:</td><td>${alert.crop}</td></tr>
                  <tr><td>Market:</td><td>${alert.market}</td></tr>
                  <tr><td>Current Price:</td><td>Rs. ${currentPrice}</td></tr>
                  <tr><td>Your Target:</td><td>Rs. ${alert.targetPrice}</td></tr>
                </table>
                <p>Now is a good time to sell!</p>
                <p>- Farmer Price Tracker Team</p>
              `
            });

            // Mark alert as triggered
            await Alert.findByIdAndUpdate(alert._id, {
              isTriggered: true,
              isActive: false
            });

            console.log(`Email sent to ${alert.userId.email}`);
          }
        }
      } catch (err) {
        console.log(`Error checking alert ${alert._id}: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('Error in checkAndNotifyAlerts:', error.message);
  }
};

module.exports = {
  createAlert,
  getMyAlerts,
  deleteAlert,
  checkAndNotifyAlerts
};