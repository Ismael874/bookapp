const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del autor es requerido'
      }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El email es requerido'
      },
      isEmail: {
        msg: 'Debe ser un email válido'
      }
    }
  }
}, {
  tableName: 'authors',
  timestamps: true,
  underscored: true
});

module.exports = Author;