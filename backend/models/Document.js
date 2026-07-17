const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
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
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  }
}, {
  tableName: 'documents'
});

module.exports = Document;
