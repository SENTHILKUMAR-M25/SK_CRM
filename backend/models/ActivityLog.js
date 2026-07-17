const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lead: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'leads', key: 'id' }
  },
  user: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    defaultValue: '{}',
    get() {
      const raw = this.getDataValue('details');
      try { return JSON.parse(raw); } catch { return {}; }
    },
    set(value) {
      this.setDataValue('details', JSON.stringify(value));
    }
  }
}, {
  tableName: 'activity_logs'
});

module.exports = ActivityLog;
