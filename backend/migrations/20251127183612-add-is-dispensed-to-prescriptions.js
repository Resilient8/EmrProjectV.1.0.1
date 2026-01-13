'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // คำสั่งเพิ่มคอลัมน์ is_dispensed เข้าไปที่ตาราง prescriptions
    await queryInterface.addColumn('prescriptions', 'is_dispensed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true // หรือ false ก็ได้แล้วแต่ design แต่ true ปลอดภัยกว่าสำหรับการเพิ่มทีหลัง
    });
  },

  async down (queryInterface, Sequelize) {
    // คำสั่งลบคอลัมน์ (เผื่อไว้ตอน undo)
    await queryInterface.removeColumn('prescriptions', 'is_dispensed');
  }
};