const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Email'
  },
  cvUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('received', 'screening', 'shortlisted', 'rejected', 'interview'),
    allowNull: false,
    defaultValue: 'received'
  }
});

Candidate.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Candidate, { foreignKey: 'userId' });

module.exports = Candidate;
