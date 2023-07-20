'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trip.init({
    userID: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    duration: DataTypes.STRING,
    fare: DataTypes.INTEGER,
    tip: DataTypes.INTEGER,
    driverRating: DataTypes.INTEGER,
    passengerRating: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};