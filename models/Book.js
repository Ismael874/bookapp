const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'books'
});

module.exports = Book;