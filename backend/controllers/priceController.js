const axios = require('axios');
const PriceHistory = require('../models/PriceHistory');

// ─────────────────────────────────────────
// GET TODAY'S PRICES
// Route: GET /api/prices/today
// ─────────────────────────────────────────
const getTodayPrices = async (req, res) => {
  try {
    const { crop, state } = req.query;

    let apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=50`;

    if (crop) apiUrl += `&filters[commodity]=${crop}`;
    if (state) apiUrl += `&filters[state]=${state}`;

    const response = await axios.get(apiUrl);
    const records = response.data.records;

    if (!records || records.length === 0) {
      return res.status(404).json({
        message: 'No price data found'
      });
    }

    const prices = records.map(record => ({
      crop: record.commodity,
      market: record.market,
      state: record.state,
      district: record.district,
      minPrice: record.min_price,
      maxPrice: record.max_price,
      modalPrice: record.modal_price,
      date: record.arrival_date
    }));

    res.json({
      message: 'Prices fetched successfully',
      count: prices.length,
      data: prices
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching prices',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────
// COMPARE PRICES ACROSS MARKETS
// Route: GET /api/prices/compare
// ─────────────────────────────────────────
const comparePrices = async (req, res) => {
  try {
    const { crop, state } = req.query;

    if (!crop) {
      return res.status(400).json({
        message: 'Please provide crop name'
      });
    }

    let apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=100&filters[commodity]=${crop}`;

    if (state) apiUrl += `&filters[state]=${state}`;

    const response = await axios.get(apiUrl);
    const records = response.data.records;

    if (!records || records.length === 0) {
      return res.status(404).json({
        message: 'No data found for this crop'
      });
    }

    const prices = records
      .map(record => ({
        crop: record.commodity,
        market: record.market,
        state: record.state,
        district: record.district,
        minPrice: record.min_price,
        maxPrice: record.max_price,
        modalPrice: record.modal_price,
        date: record.arrival_date
      }))
      .sort((a, b) => b.modalPrice - a.modalPrice);

    res.json({
      message: 'Comparison data fetched',
      crop: crop,
      count: prices.length,
      data: prices
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error comparing prices',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────
// GET PRICE HISTORY
// Route: GET /api/prices/history/:crop
// ─────────────────────────────────────────
const getPriceHistory = async (req, res) => {
  try {
    const { crop } = req.params;

    const history = await PriceHistory.find({
      crop: new RegExp(crop, 'i')
    })
    .sort({ recordedDate: -1 })
    .limit(30);

    res.json({
      message: 'Price history fetched',
      crop: crop,
      count: history.length,
      data: history
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching history',
      error: error.message
    });
  }
};

module.exports = {
  getTodayPrices,
  comparePrices,
  getPriceHistory
};