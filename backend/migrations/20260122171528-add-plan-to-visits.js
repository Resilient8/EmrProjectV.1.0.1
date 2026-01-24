'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // คำสั่งเพิ่มคอลัมน์ plan
    await queryInterface.addColumn('Visits', 'plan', {
      type: Sequelize.TEXT, // เก็บข้อความยาวๆ ได้
      allowNull: true,      // เป็นค่าว่างได้
      after: 'referral_notes' // (Option) ให้แทรกต่อจากคอลัมน์ referral_notes (MySQL Only)
    });
  },

  async down (queryInterface, Sequelize) {
    // คำสั่งย้อนกลับ (ลบคอลัมน์ทิ้ง)
    await queryInterface.removeColumn('Visits', 'plan');
  }
};