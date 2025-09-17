'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('VisitSymptoms', [
      // Visit ID 1 (นายสมชาย): มีไข้ (2), ไอ (3)
      { visit_id: 1, symptom_id: 2, duration: '2 วัน', level: 'pain' },
      { visit_id: 1, symptom_id: 3, duration: '2 วัน', level: 'irritation' },
      // Visit ID 2 (นางสาวสมหญิง): ไม่มีอาการสำคัญ
      // Visit ID 3 (เด็กชายมานะ): มีไข้ (2)
      { visit_id: 3, symptom_id: 2, duration: '1 วัน', level: 'injury' },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VisitSymptoms', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};