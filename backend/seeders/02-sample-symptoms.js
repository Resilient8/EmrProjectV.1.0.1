'use strict';
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('symptoms', [
      // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออกทั้งหมด
      { symptom_name: 'ปวดหัว' }, 
      { symptom_name: 'มีไข้' },
      { symptom_name: 'ไอ' },
      { symptom_name: 'เจ็บคอ' },
      { symptom_name: 'มีน้ำมูก' },
      { symptom_name: 'ปวดท้อง' },
      { symptom_name: 'ท้องเสีย' },
      { symptom_name: 'คลื่นไส้' },
      { symptom_name: 'อาเจียน' },
      { symptom_name: 'ผื่นคัน' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('symptoms', null, {});
  }
};