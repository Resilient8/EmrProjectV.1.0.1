'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('diagnosis', { // ชื่อตารางเป็นเอกพจน์ (diagnosis) ตามโมเดล
      diagnosis_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      diagnosis_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('diagnosis');
  }
};