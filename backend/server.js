const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const priceRoutes = require('./routes/prices');
const alertRoutes = require('./routes/alerts');
const { checkAndNotifyAlerts } = require('./controllers/alertController');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/alerts', alertRoutes);

// Runs every day at 8 AM automatically 
cron.schedule('0 8 * * *', () => {
  console.log('Running daily price alert check...');
  checkAndNotifyAlerts();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Farmer Price Tracker API is running!',
    status: 'success'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});