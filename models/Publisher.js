const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publisher = sequelize.define('Publisher', {
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
        msg: 'El nombre de la editorial es requerido'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El teléfono es requerido'
      }
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El país es requerido'
      }
    }
  }
}, {
  tableName: 'publishers',
  timestamps: true,
  underscored: true
});

module.exports = Publisher;