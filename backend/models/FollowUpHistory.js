const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FollowUpHistory = sequelize.define('FollowUpHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lead: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'leads', key: 'id' }
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: { notEmpty: { msg: 'Follow-up date is required' } }
  },
  followUpTime: {
    type: DataTypes.STRING(10),
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('Called', 'Emailed', 'Meeting', 'Proposal Sent', 'Follow-up', 'Closed', 'Waiting', 'Approved', 'Rejected'),
    defaultValue: 'Follow-up'
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Remark is required' } }
  },
  nextFollowUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nextFollowUpTime: {
    type: DataTypes.STRING(10),
    defaultValue: ''
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'follow_up_history'
});

module.exports = FollowUpHistory;
