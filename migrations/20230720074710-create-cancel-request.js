"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cancelRequest", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        type: Sequelize.INTEGER,
      },
      driverId: {
        type: Sequelize.INTEGER,
      },
      penalty: {
        type: Sequelize.INTEGER,
      },
      cancelTime: {
        type: Sequelize.DATE,
      },
      cancelledBy: {
        type: Sequelize.STRING,
      },
      reason: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("cancelRequest");
  },
};
