'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // เพิ่มคอลัมน์ avatar_url ให้ตาราง users
    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.STRING(255),
      allowNull: true, // อนุญาตให้เป็นค่าว่างได้ (ถ้ายังไม่มีรูป)
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    // คำสั่งสำหรับลบคอลัมน์ (เผื่อ Undo)
    await queryInterface.removeColumn('users', 'avatar_url');
  }
};