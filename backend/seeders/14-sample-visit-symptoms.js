'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('VisitSymptoms', [
      // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออกจากทุกแถว
      { visit_id: 1, symptom_id: 2, duration: '2 วัน', level: 'pain' },
      { visit_id: 1, symptom_id: 3, duration: '2 วัน', level: 'irritation' },
      { visit_id: 3, symptom_id: 2, duration: '1 วัน', level: 'pain' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VisitSymptoms', null, {});
  }
};