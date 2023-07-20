'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vehicle.init({
    mode: DataTypes.STRING,
    make: DataTypes.STRING,
    year: DataTypes.NUMBER,
    capacity: DataTypes.NUMBER,
    color: DataTypes.STRING,
    plateNumber: DataTypes.STRING,
    driver_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};