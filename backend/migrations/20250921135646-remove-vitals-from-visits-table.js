'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Transaction เพื่อให้แน่ใจว่าถ้ามีคำสั่งไหนพลาด จะยกเลิกทั้งหมด
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Visits', 'temperature', { transaction });
      await queryInterface.removeColumn('Visits', 'pulse', { transaction });
      await queryInterface.removeColumn('Visits', 'respiration', { transaction });
      await queryInterface.removeColumn('Visits', 'blood_pressure', { transaction });
      await queryInterface.removeColumn('Visits', 'height', { transaction });
      await queryInterface.removeColumn('Visits', 'weight', { transaction });
      await queryInterface.removeColumn('Visits', 'bmi', { transaction });
      await queryInterface.removeColumn('Visits', 'waist_circumference', { transaction });
      await queryInterface.removeColumn('Visits', 'allergies', { transaction });
      await queryInterface.removeColumn('Visits', 'underlying_diseases', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    // Transaction สำหรับการย้อนกลับ
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Visits', 'temperature', { type: Sequelize.DECIMAL(4, 1) }, { transaction });
      await queryInterface.addColumn('Visits', 'pulse', { type: Sequelize.INTEGER }, { transaction });
      await queryInterface.addColumn('Visits', 'respiration', { type: Sequelize.INTEGER }, { transaction });
      await queryInterface.addColumn('Visits', 'blood_pressure', { type: Sequelize.STRING(20) }, { transaction });
      await queryInterface.addColumn('Visits', 'height', { type: Sequelize.DECIMAL(5, 1) }, { transaction });
      await queryInterface.addColumn('Visits', 'weight', { type: Sequelize.DECIMAL(5, 1) }, { transaction });
      await queryInterface.addColumn('Visits', 'bmi', { type: Sequelize.DECIMAL(4, 2) }, { transaction });
      await queryInterface.addColumn('Visits', 'waist_circumference', { type: Sequelize.DECIMAL(5, 1) }, { transaction });
      await queryInterface.addColumn('Visits', 'allergies', { type: Sequelize.TEXT }, { transaction });
      await queryInterface.addColumn('Visits', 'underlying_diseases', { type: Sequelize.TEXT }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};