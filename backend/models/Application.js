const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Candidate = require('./Candidate');
const User = require('./User');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General Position'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  interviewTime: {
    type: DataTypes.STRING, // e.g. "14:00" or "02:30 PM"
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'applied'
  }
});

// Setup relationships
Candidate.hasMany(Application, { foreignKey: 'candidateId', onDelete: 'CASCADE' });
Application.belongsTo(Candidate, { foreignKey: 'candidateId' });

User.hasMany(Application, { foreignKey: 'recruiterId', onDelete: 'SET NULL' });
Application.belongsTo(User, { foreignKey: 'recruiterId' });

module.exports = Application;
