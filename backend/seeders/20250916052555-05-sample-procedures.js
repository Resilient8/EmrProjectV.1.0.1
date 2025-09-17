'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('procedures', [
      { procedure_name: 'ซักประวัติและตรวจร่างกายเบื้องต้น' }, { procedure_name: 'วัดสัญญาณชีพ' }, { procedure_name: 'ไม่มีหัตถการเฉพาะ' }, { procedure_name: 'การล้างแผล' }, { procedure_name: 'การเย็บแผล' }, { procedure_name: 'การตัดไหม' }, { procedure_name: 'การกรีดระบายหนอง' }, { procedure_name: 'การฉีดยาเข้ากล้ามเนื้อ (IM)' }, { procedure_name: 'การฉีดยาเข้าใต้ผิวหนัง (SC)' }, { procedure_name: 'การให้ยาทางหลอดเลือดดำ (IV)' }, { procedure_name: 'การเปิดเส้นเลือดดำเพื่อให้สารน้ำ' }, { procedure_name: 'การพ่นยาขยายหลอดลม' }, { procedure_name: 'การเจาะเลือดส่งตรวจ' }, { procedure_name: 'การเก็บตัวอย่างปัสสาวะ' }, { procedure_name: 'การ Swab หาเชื้อ' },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('procedures', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};