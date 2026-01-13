'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('diagnoses', [
      // 🛑 [แก้ไข] เพิ่ม created_at และ updated_at (snake_case) ในทุกรายการ
      { diagnosis_name: 'ไข้หวัดธรรมดา (Common Cold)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ไข้หวัดใหญ่ (Influenza)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'คออักเสบ (Pharyngitis)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'หลอดลมอักเสบ (Bronchitis)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'อาหารเป็นพิษ (Food Poisoning)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'โรคกระเพาะอาหารอักเสบ (Gastritis)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'กรดไหลย้อน (GERD)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ความดันโลหิตสูง (Hypertension)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'โรคเบาหวาน (Diabetes Mellitus)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ไขมันในเลือดสูง (Dyslipidemia)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ปวดศีรษะไมเกรน (Migraine)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ปวดศีรษะจากความเครียด (Tension Headache)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ออฟฟิศซินโดรม (Myofascial Pain Syndrome)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'กล้ามเนื้ออักเสบ (Myositis)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'ลมพิษ (Urticaria)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'โรคจมูกอักเสบจากภูมิแพ้ (Allergic Rhinitis)', created_at: new Date(), updated_at: new Date() },
      { diagnosis_name: 'อยู่ระหว่างการวินิจฉัย', created_at: new Date(), updated_at: new Date() }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diagnoses', null, {});
  }
};