'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // พยายามเพิ่มคอลัมน์
      await queryInterface.addColumn('users', 'department', {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
        after: 'role'
      });
    } catch (error) {
      // ถ้า Error (เช่น มีคอลัมน์อยู่แล้ว) ให้ข้ามไป ไม่ต้องทำอะไร
      console.log('⚠️ Column "department" already exists. Skipping...');
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('users', 'department');
    } catch (error) {
      console.log('⚠️ Column "department" does not exist. Skipping...');
    }
  }
};