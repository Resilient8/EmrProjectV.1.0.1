'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pharmacists', [
      { user_id: 5, license_number: 'PHARM-001' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pharmacists', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};