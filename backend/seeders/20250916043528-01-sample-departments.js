'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments', [
      { name: 'อายุรกรรม' },
      { name: 'ศัลยกรรม' },
      { name: 'กุมารเวชกรรม' },
      { name: 'ห้องฉุกเฉิน' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};