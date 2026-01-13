'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. เพิ่ม column 'phone'
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'email' // (Optional) สั่งให้ไปแทรกต่อจาก email เพื่อความสวยงาม
    });

    // 2. เพิ่ม column 'created_at'
    await queryInterface.addColumn('users', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // 3. เพิ่ม column 'updated_at'
    await queryInterface.addColumn('users', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    // คำสั่งย้อนกลับ (เผื่อ Undo)
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'created_at');
    await queryInterface.removeColumn('users', 'updated_at');
  }
};