'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Visits', [
      {
        patient_id: '1102004567891', 
        UserID: 3,
        visit_datetime: new Date('2025-09-10T09:05:00'),
        notes: 'ผู้ป่วยมีอาการไข้ต่ำๆ ไอเล็กน้อย 2 วันก่อนมา'
        // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออก
      },
      {
        patient_id: '1509900123456', 
        UserID: 4,
        visit_datetime: new Date('2025-09-11T14:30:00'),
        notes: 'มาทำแผลตามนัด แผลแห้งดี ไม่มีอาการอักเสบ'
        // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออก
      },
      {
        patient_id: '1751100098765', 
        UserID: 3,
        visit_datetime: new Date(), 
        notes: 'ผู้ปกครองแจ้งว่าซึมลง เบื่ออาหาร มีไข้สูง'
        // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออก
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Visits', null, {});
  }
};