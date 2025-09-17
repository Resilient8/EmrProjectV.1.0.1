'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patients', { // <-- ใช้ชื่อ 'patients' ตามใน Model
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, // Primary key ควรเป็น non-nullable
      },
      prefix: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: true, // ตาม Model ของคุณ
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: true, // ตาม Model ของคุณ
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      patient_id: {
        type: Sequelize.STRING(20),
        allowNull: false, // Unique key ควรเป็น non-nullable เพื่อความถูกต้องของข้อมูล
        unique: true,
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      // ไม่มี createdAt และ updatedAt เพราะใน Model ตั้งค่า timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patients');
  }
};