'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('doctors', [
      // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออกจากทุกแถว
      { user_id: 1, specialization: 'ศัลยแพทย์ทั่วไป', license_number: 'DOC-001', department_id: 2 },
      { user_id: 2, specialization: 'อายุรแพทย์', license_number: 'DOC-002', department_id: 1 }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctors', null, {});
  }
};