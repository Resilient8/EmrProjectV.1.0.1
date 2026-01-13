'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. เพิ่มคอลัมน์ created_at
    await queryInterface.addColumn('visitprocedures', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // 2. เพิ่มคอลัมน์ updated_at
    await queryInterface.addColumn('visitprocedures', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    // ลบคอลัมน์ออกหากมีการ Rollback
    await queryInterface.removeColumn('visitprocedures', 'created_at');
    await queryInterface.removeColumn('visitprocedures', 'updated_at');
  }
};