'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // สั่งแก้ไข column 'diagnosis_code' ในตาราง 'diagnoses'
    await queryInterface.changeColumn('diagnoses', 'diagnosis_code', {
      type: Sequelize.STRING,
      allowNull: true, // ✅ แก้ให้ยอมรับค่าว่าง (NULL) ได้
    });
  },

  async down (queryInterface, Sequelize) {
    // กรณี Rollback ให้แก้กลับเป็นห้ามว่างเหมือนเดิม
    await queryInterface.changeColumn('diagnoses', 'diagnosis_code', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};