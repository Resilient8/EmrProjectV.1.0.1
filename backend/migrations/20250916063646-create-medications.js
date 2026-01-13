// backend/migrations/20250916063646-create-medications.js

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 🛑 [แก้ไข] เพิ่มคอลัมน์ medication_code ที่ขาดหายไป
      medication_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      generic_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      trade_name: {
        type: Sequelize.STRING
      },
      dosage_form: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // หมายเหตุ: ละเว้น createdAt/updatedAt เพราะ Migration อื่นๆ ก็ไม่มี
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medications');
  }
};