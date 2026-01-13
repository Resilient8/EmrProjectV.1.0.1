'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // เช็คก่อนว่ามีไหม ถ้าไม่มีค่อยสร้าง
    const tableInfo = await queryInterface.describeTable('medications');

    if (!tableInfo['created_at']) {
      await queryInterface.addColumn('medications', 'created_at', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    if (!tableInfo['updated_at']) {
      await queryInterface.addColumn('medications', 'updated_at', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('medications', 'created_at');
    await queryInterface.removeColumn('medications', 'updated_at');
  }
};