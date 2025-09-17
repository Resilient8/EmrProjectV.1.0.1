'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('diagnosis', [
      { diagnosis_name: 'ไข้หวัดธรรมดา (Common Cold)' }, { diagnosis_name: 'ไข้หวัดใหญ่ (Influenza)' }, { diagnosis_name: 'คออักเสบ (Pharyngitis)' }, { diagnosis_name: 'หลอดลมอักเสบ (Bronchitis)' }, { diagnosis_name: 'อาหารเป็นพิษ (Food Poisoning)' }, { diagnosis_name: 'โรคกระเพาะอาหารอักเสบ (Gastritis)' }, { diagnosis_name: 'กรดไหลย้อน (GERD)' }, { diagnosis_name: 'ความดันโลหิตสูง (Hypertension)' }, { diagnosis_name: 'โรคเบาหวาน (Diabetes Mellitus)' }, { diagnosis_name: 'ไขมันในเลือดสูง (Dyslipidemia)' }, { diagnosis_name: 'ปวดศีรษะไมเกรน (Migraine)' }, { diagnosis_name: 'ปวดศีรษะจากความเครียด (Tension Headache)' }, { diagnosis_name: 'ออฟฟิศซินโดรม (Myofascial Pain Syndrome)' }, { diagnosis_name: 'กล้ามเนื้ออักเสบ (Myositis)' }, { diagnosis_name: 'ลมพิษ (Urticaria)' }, { diagnosis_name: 'โรคจมูกอักเสบจากภูมิแพ้ (Allergic Rhinitis)' }, { diagnosis_name: 'อยู่ระหว่างการวินิจฉัย' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diagnosis', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};