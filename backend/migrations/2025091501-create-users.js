'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', { // <-- ใช้ชื่อ 'users' (ตัวเล็ก) ตามใน Model
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      prefix: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('Doctor', 'Nurse', 'Admin', 'Pharmacist'),
        allowNull: false,
      },
      // หมายเหตุ: เราไม่เพิ่ม createdAt และ updatedAt 
      // เพราะใน Model ของคุณตั้งค่า timestamps: false ไว้ ซึ่งถูกต้องแล้ว
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};