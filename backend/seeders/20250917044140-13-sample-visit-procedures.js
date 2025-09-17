'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('VisitProcedures', [
      // Visit ID 1 (นายสมชาย): ตรวจรักษาโรคทั่วไป
      { visit_id: 1, service_id: 1, procedure_id: 1, diagnosis_id: 1, notes: 'จ่ายยาลดไข้' },
      // Visit ID 2 (นางสาวสมหญิง): ทำแผล
      { visit_id: 2, service_id: 4, procedure_id: 4, diagnosis_id: null, notes: 'ทำแผลที่หัวเข่า' },
      // Visit ID 3 (เด็กชายมานะ): ตรวจรักษาโรคทั่วไป
      { visit_id: 3, service_id: 1, procedure_id: 1, diagnosis_id: 2, notes: 'สงสัยไข้หวัดใหญ่' },
    ], {});
  },    
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VisitProcedures', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};