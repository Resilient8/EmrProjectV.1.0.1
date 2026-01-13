'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ✅ สั่งเพิ่มคอลัมน์ department เข้าไปที่ตาราง users
    await queryInterface.addColumn('users', 'department', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
      after: 'role' // (Optional) อยากให้แทรกต่อจากคอลัมน์ role (MySQL only)
    });
  },

  async down (queryInterface, Sequelize) {
    // ❌ สั่งลบคอลัมน์ออก (เผื่ออยาก Undo)
    await queryInterface.removeColumn('users', 'department');
  }
};