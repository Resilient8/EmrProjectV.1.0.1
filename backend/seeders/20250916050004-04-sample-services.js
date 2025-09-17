'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('services', [
      { service_name: 'ตรวจรักษาโรคทั่วไป' }, { service_name: 'ปรึกษาสุขภาพ' }, { service_name: 'ติดตามอาการ' }, { service_name: 'ทำแผล-ล้างแผล' }, { service_name: 'เย็บแผล' }, { service_name: 'ตัดไหม' }, { service_name: 'เจาะฝี' }, { service_name: 'ฉีดวัคซีนไข้หวัดใหญ่' }, { service_name: 'ฉีดวัคซีนบาดทะยัก' }, { service_name: 'ฉีดยาตามแพทย์สั่ง' }, { service_name: 'ฉีดยาคุมกำเนิด' }, { service_name: 'เจาะเลือดตรวจสุขภาพ' }, { service_name: 'ตรวจปัสสาวะ' }, { service_name: 'ตรวจหาเชื้อโควิด (ATK)' }, { service_name: 'ตรวจระดับน้ำตาลในเลือด' }, { service_name: 'ให้สารน้ำทางหลอดเลือด' }, { service_name: 'พ่นยาขยายหลอดลม' }, { service_name: 'ออกใบรับรองแพทย์' }, { service_name: 'ขอประวัติการรักษา' }, { service_name: 'ไม่รับการรักษา' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};