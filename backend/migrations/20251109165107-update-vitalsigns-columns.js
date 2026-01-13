'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // "คำสั่ง" ให้ "เพิ่ม" 3 คอลัมน์ใหม่
    await queryInterface.addColumn('vital_signs', 'blood_pressure_systolic', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('vital_signs', 'blood_pressure_diastolic', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('vital_signs', 'oxygen_saturation', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    // "คำสั่ง" ให้ "ลบ" คอลัมน์เก่า (ที่เป็น String)
    await queryInterface.removeColumn('vital_signs', 'blood_pressure');

  },

  async down(queryInterface, Sequelize) {

    // (คำสั่ง "ย้อนกลับ"... ถ้าเรา Rollback)
    await queryInterface.removeColumn('vital_signs', 'blood_pressure_systolic');
    await queryInterface.removeColumn('vital_signs', 'blood_pressure_diastolic');
    await queryInterface.removeColumn('vital_signs', 'oxygen_saturation');

    await queryInterface.addColumn('vital_signs', 'blood_pressure', {
      type: DataTypes.STRING(10), // (คืนค่าคอลัมน์เก่า)
      allowNull: true,
    });

  }
};