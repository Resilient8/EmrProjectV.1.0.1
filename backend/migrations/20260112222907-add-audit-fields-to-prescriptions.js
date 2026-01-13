'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🚩 เพิ่มคอลัมน์เก็บข้อมูลว่าถูกแก้หรือไม่
    await queryInterface.addColumn('prescriptions', 'is_edited', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // 🚩 เพิ่มคอลัมน์เก็บชื่อคนแก้ไข
    await queryInterface.addColumn('prescriptions', 'edited_by', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    // 🚩 เพิ่มคอลัมน์เก็บประวัติสรุปการแก้ไข (เช่น เปลี่ยนยาจาก A เป็น B)
    await queryInterface.addColumn('prescriptions', 'edit_history', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // สำหรับ Rollback (สั่งลบคอลัมน์ทิ้งกรณีอยากย้อนกลับ)
    await queryInterface.removeColumn('prescriptions', 'is_edited');
    await queryInterface.removeColumn('prescriptions', 'edited_by');
    await queryInterface.removeColumn('prescriptions', 'edit_history');
  }
};