const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  qa: {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'bookapp',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
};