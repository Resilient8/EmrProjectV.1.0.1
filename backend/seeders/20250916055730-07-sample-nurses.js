'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('nurses', [
      { user_id: 3, license_number: 'NRS-001', level: 'พยาบาลวิชาชีพ' },
      { user_id: 4, license_number: 'NRS-002', level: 'พยาบาลวิชาชีพ' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('nurses', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};