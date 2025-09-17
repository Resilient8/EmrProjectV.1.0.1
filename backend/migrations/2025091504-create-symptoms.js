'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('symptoms', { // <-- ใช้ชื่อ 'symptoms' (ตัวเล็ก) ตามใน Model
      symptom_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      symptom_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('symptoms');
  }
};