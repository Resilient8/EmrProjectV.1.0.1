'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('services', [
      // 🛑 [แก้ไข] เพิ่ม created_at และ updated_at (snake_case) ในทุกรายการ
      { service_name: 'ตรวจรักษาโรคทั่วไป', price: 200.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ปรึกษาสุขภาพ', price: 100.00, created_at: new Date(), updated_at: new Date() },
      { service_name: 'ติดตามอาการ', price: 0.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ทำแผล-ล้างแผล', price: 150.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'เย็บแผล', price: 500.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ตัดไหม', price: 150.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'เจาะฝี', price: 400.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ฉีดวัคซีนไข้หวัดใหญ่', price: 650.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ฉีดวัคซีนบาดทะยัก', price: 400.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ฉีดยาตามแพทย์สั่ง', price: 100.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ฉีดยาคุมกำเนิด', price: 500.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'เจาะเลือดตรวจสุขภาพ', price: 50.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ตรวจปัสสาวะ', price: 50.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ตรวจหาเชื้อโควิด (ATK)', price: 150.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ตรวจระดับน้ำตาลในเลือด', price: 50.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ให้สารน้ำทางหลอดเลือด', price: 800.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'พ่นยาขยายหลอดลม', price: 300.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ออกใบรับรองแพทย์', price: 100.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ขอประวัติการรักษา', price: 0.00, created_at: new Date(), updated_at: new Date() }, 
      { service_name: 'ไม่รับการรักษา', price: 0.00, created_at: new Date(), updated_at: new Date() }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  }
};