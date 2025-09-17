'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctors', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE' // ถ้า user ถูกลบ, profile doctor ก็ควรถูกลบตาม
      },
      specialization: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      license_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'departments', key: 'id' },
        onDelete: 'SET NULL' // ถ้าแผนกถูกลบ, doctor อาจจะยังอยู่แต่ไม่มีแผนก
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctors');
  }
};