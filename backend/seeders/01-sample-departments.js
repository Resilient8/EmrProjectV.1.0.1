'use strict';
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments', [
      { 
        name: 'อายุรกรรม', 
        createdAt: new Date(), // ✅ ใช้ CamelCase ตามโครงสร้างตารางที่ถูก Migrate แล้ว
        updatedAt: new Date()  // ✅ ใช้ CamelCase
      },
      { 
        name: 'ศัลยกรรม', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        name: 'กุมารเวชกรรม', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        name: 'ห้องฉุกเฉิน', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  }
};