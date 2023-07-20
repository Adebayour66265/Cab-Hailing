'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cancelRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cancelRequest.init({
    userID: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    penalty: DataTypes.INTEGER,
    cancelTime: DataTypes.DATE,
    cancelledBy: DataTypes.STRING,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cancelRequest',
  });
  return cancelRequest;
};