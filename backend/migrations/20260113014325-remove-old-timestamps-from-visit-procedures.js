'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ลบคอลัมน์ CamelCase ที่ซ้ำซ้อนออก เพื่อไม่ให้ไปตีกับ snake_case
    await queryInterface.removeColumn('visitprocedures', 'createdAt');
    await queryInterface.removeColumn('visitprocedures', 'updatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    // ถ้าอยากย้อนกลับ ก็สร้างคืน (แต่ปกติเราจะไม่ย้อนกลับไปใช้ชื่อเดิมแล้ว)
    await queryInterface.addColumn('visitprocedures', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('visitprocedures', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};