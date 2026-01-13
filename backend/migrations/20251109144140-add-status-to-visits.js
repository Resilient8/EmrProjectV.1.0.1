'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // นี่คือ "คำสั่ง" ให้ "เพิ่มคอลัมน์ status"
    await queryInterface.addColumn('Visits', 'status', {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'ยังกรอกไม่เสร็จ'
    });

  },

  async down(queryInterface, Sequelize) {

    // นี่คือ "คำสั่ง" ให้ "ลบคอลัมน์ status" (ถ้าเรา Rollback)
    await queryInterface.removeColumn('Visits', 'status');

  }
};