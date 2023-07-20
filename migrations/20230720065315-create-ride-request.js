"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RideRequest", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        type: Sequelize.INTEGER,
      },
      dateAndTime: {
        type: Sequelize.DATE,
      },
      rideType: {
        type: Sequelize.STRING,
      },
      pickupLocation: {
        type: Sequelize.STRING,
      },
      dropOffLocation: {
        type: Sequelize.STRING,
      },
      estimateFare: {
        type: Sequelize.INTEGER,
      },
      noOfPassengers: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("RideRequest");
  },
};
