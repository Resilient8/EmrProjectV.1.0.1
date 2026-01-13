'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('diagnoses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // คอลัมน์ที่ถูกเพิ่มเข้าไปก่อนหน้านี้
      diagnosis_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true
      },
      diagnosis_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // 🛑 [แก้ไข] เปลี่ยนจาก createdAt เป็น created_at (แก้ปัญหา Unknown column)
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // 🛑 [แก้ไข] เปลี่ยนจาก updatedAt เป็น updated_at
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('diagnoses');
  }
};