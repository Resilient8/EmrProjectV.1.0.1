'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Visits', [
      {
        // นายสมชาย ใจดี (patient_id) ถูกบันทึกโดย พว.สมศรี สุขใจ (UserID: 3)
        patient_id: '1102004567891', 
        UserID: 3,
        visit_datetime: new Date('2025-09-10T09:05:00'),
        temperature: 37.8,
        pulse: 88,
        respiration: 20,
        blood_pressure: '120/80',
        notes: 'ผู้ป่วยมีอาการไข้ต่ำๆ ไอเล็กน้อย 2 วันก่อนมา'
      },
      {
        // นางสาวสมหญิง รักสงบ (patient_id) ถูกบันทึกโดย พว.มานะ อดทน (UserID: 4)
        patient_id: '1509900123456', 
        UserID: 4,
        visit_datetime: new Date('2025-09-11T14:30:00'),
        temperature: 36.5,
        pulse: 76,
        respiration: 18,
        blood_pressure: '110/70',
        notes: 'มาทำแผลตามนัด แผลแห้งดี ไม่มีอาการอักเสบ'
      },
      {
        // เด็กชายมานะ เรียนดี (patient_id) ถูกบันทึกโดย พว.สมศรี สุขใจ (UserID: 3)
        patient_id: '1751100098765', 
        UserID: 3,
        visit_datetime: new Date(), // เวลาปัจจุบัน
        temperature: 38.5,
        pulse: 110,
        respiration: 22,
        blood_pressure: '100/60',
        notes: 'ผู้ปกครองแจ้งว่าซึมลง เบื่ออาหาร มีไข้สูง'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Visits', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};