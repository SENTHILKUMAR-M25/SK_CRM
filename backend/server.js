const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const init = async () => {
  try {
    const { User, Lead, FollowUpHistory, ActivityLog, Document } = require('./models');
    await sequelize.sync({ alter: false });
    console.log('Database tables synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
};

init();

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing connections...`);
  try {
    await sequelize.close();
    console.log('Database connections closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing connections:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
