'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      { category_name: 'ยาแก้ปวด / ลดไข้' }, { category_name: 'ยาปฏิชีวนะ' }, { category_name: 'ยาแก้แพ้ / ลดน้ำมูก' }, { category_name: 'ยาใช้ภายนอก' }, { category_name: 'อุปกรณ์ทำแผล' }, { category_name: 'วิตามินและอาหารเสริม' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};