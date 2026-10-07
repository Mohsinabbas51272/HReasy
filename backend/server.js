const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const candidateRoutes = require('./routes/candidate.routes');
const recruitmentRoutes = require('./routes/recruitment.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/recruitment', recruitmentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  return res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Database Sync and Server Launch
const startServer = async () => {
  try {
    // Authenticate and sync model definitions
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: true }); // Automatically updates tables to match schema definitions
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
