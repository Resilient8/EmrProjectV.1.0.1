'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // คำสั่งเพิ่มคอลัมน์ locations
    await queryInterface.addColumn('VisitSymptoms', 'locations', {
      type: Sequelize.JSON, // เก็บเป็น JSON
      allowNull: true,      // อนุญาตให้เป็น Null ได้ (สำหรับข้อมูลเก่า)
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    // คำสั่งลบคอลัมน์ (กรณี Rollback)
    await queryInterface.removeColumn('VisitSymptoms', 'locations');
  }
};