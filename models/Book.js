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
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El título es requerido'
      }
    }
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'cover_image'
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'publication_year',
    validate: {
      notEmpty: {
        msg: 'El año de publicación es requerido'
      },
      isInt: {
        msg: 'El año debe ser un número válido'
      },
      min: {
        args: [1000],
        msg: 'El año debe ser mayor a 1000'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: `El año no puede ser mayor a ${new Date().getFullYear()}`
      }
    }
  }
}, {
  tableName: 'books',
  timestamps: true,
  underscored: true
});

module.exports = Book;