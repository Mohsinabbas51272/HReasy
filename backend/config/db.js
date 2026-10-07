const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/hreasy_db';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Change to console.log to debug SQL queries
  define: {
    timestamps: true, // Auto-create createdAt and updatedAt
  }
});

module.exports = sequelize;
