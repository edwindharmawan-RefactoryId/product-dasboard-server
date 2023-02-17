'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Items.hasMany(models.Transactions)
    }
  }
  Items.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please add name item.'
        },
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: 'Stock should an integer.'
        }
      }
    },
    sold: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: 'Stock should an integer.'
        }
      }
    },
    itemType: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please add type of the item.'
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Items',
  });
  return Items;
};