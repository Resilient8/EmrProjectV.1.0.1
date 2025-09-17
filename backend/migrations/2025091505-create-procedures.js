'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('procedures', {
      procedure_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      procedure_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true // ชื่อหัตถการไม่ควรซ้ำกัน
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('procedures');
  }
};