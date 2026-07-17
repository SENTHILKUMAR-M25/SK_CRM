const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { notEmpty: { msg: 'Company name is required' } }
  },
  contactPerson: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'Contact person is required' } }
  },
  contactNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { notEmpty: { msg: 'Contact number is required' } }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { isEmail: { msg: 'Invalid email' } }
  },
  website: {
    type: DataTypes.STRING(200),
    defaultValue: ''
  },
  businessAddress: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  serviceRequired: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { notEmpty: { msg: 'Service required is required' } }
  },
  leadSource: {
    type: DataTypes.ENUM('Website', 'Referral', 'Social Media', 'Cold Call', 'Email Campaign', 'Walk-in', 'Other'),
    defaultValue: 'Website'
  },
  priority: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('Waiting', 'Approved', 'Rejected'),
    defaultValue: 'Waiting'
  },
  remark: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  nextFollowUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nextFollowUpTime: {
    type: DataTypes.STRING(10),
    defaultValue: ''
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'leads'
});

module.exports = Lead;
