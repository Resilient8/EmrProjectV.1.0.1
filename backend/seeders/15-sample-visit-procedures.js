// ใน backend/seeders/15-sample-visit-procedures.js

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('VisitProcedures', [
      // 🛑 [แก้ไข] เพิ่ม createdAt และ updatedAt กลับเข้าไป
      { visit_id: 1, service_id: 1, procedure_id: 1, diagnosis_id: 1, notes: 'จ่ายยาลดไข้', createdAt: new Date(), updatedAt: new Date() }, 
      { visit_id: 2, service_id: 4, procedure_id: 4, diagnosis_id: null, notes: 'ทำแผลที่หัวเข่า', createdAt: new Date(), updatedAt: new Date() }, 
      { visit_id: 3, service_id: 1, procedure_id: 1, diagnosis_id: 2, notes: 'สงสัยไข้หวัดใหญ่', createdAt: new Date(), updatedAt: new Date() }, 
    ], {});
  }, 	
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VisitProcedures', null, {});
  }
};