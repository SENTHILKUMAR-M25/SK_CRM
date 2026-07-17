const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: false
    },
    pool: {
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_NAME }`);
  } catch (error) {
    console.error(`MySQL connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
