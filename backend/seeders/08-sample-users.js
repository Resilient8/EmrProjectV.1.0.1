'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = bcrypt.hashSync('password123', 10);
    await queryInterface.bulkInsert('users', [
      // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออกจากทุกแถว
      { prefix: 'นพ.', first_name: 'เก่งกาจ', last_name: 'รักษาดี', email: 'doctor.keng@emr.com', password_hash: hashedPassword, role: 'Doctor' },
      { prefix: 'พญ.', first_name: 'ใจดี', last_name: 'ช่วยเหลือ', email: 'doctor.jai@emr.com', password_hash: hashedPassword, role: 'Doctor' },
      { prefix: 'พว.', first_name: 'สมศรี', last_name: 'สุขใจ', email: 'nurse.somsri@emr.com', password_hash: hashedPassword, role: 'Nurse' },
      { prefix: 'พว.', first_name: 'มานะ', last_name: 'อดทน', email: 'nurse.mana@emr.com', password_hash: hashedPassword, role: 'Nurse' },
      { prefix: 'ภกญ.', first_name: 'งามตา', last_name: 'จัดยา', email: 'pharmacist.n@emr.com', password_hash: hashedPassword, role: 'Pharmacist' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};