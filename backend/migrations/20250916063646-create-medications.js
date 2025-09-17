'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medications', {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'products', // เชื่อมกับตาราง products
          key: 'id',
        },
        onDelete: 'CASCADE' // ถ้า product ถูกลบ, ข้อมูลยานี้ก็ควรถูกลบตาม
      },
      generic_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dosage_form: {
        type: Sequelize.STRING,
        allowNull: true
      },
      strength: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contraindications: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medications');
  }
};