'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ---------------------------------------------------------
    // 1. ตรวจสอบและจัดการตาราง visitprocedures
    // ---------------------------------------------------------
    const visitProceduresCols = await queryInterface.describeTable('visitprocedures');
    
    // ถ้ามี createdAt (ตัวใหญ่) ให้ลบทิ้ง
    if (visitProceduresCols.createdAt) {
      await queryInterface.removeColumn('visitprocedures', 'createdAt');
    }
    if (visitProceduresCols.updatedAt) {
      await queryInterface.removeColumn('visitprocedures', 'updatedAt');
    }

    // ตั้งค่า created_at (ตัวเล็ก) ให้มี Default เพื่อกัน Error 1364
    await queryInterface.changeColumn('visitprocedures', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // ---------------------------------------------------------
    // 2. ตรวจสอบและจัดการตาราง diagnoses
    // ---------------------------------------------------------
    const diagnosesCols = await queryInterface.describeTable('diagnoses');
    
    if (diagnosesCols.createdAt) {
      await queryInterface.removeColumn('diagnoses', 'createdAt');
    }
    if (diagnosesCols.updatedAt) {
      await queryInterface.removeColumn('diagnoses', 'updatedAt');
    }

    // ตั้งค่า created_at ให้ตาราง diagnoses ด้วย
    await queryInterface.changeColumn('diagnoses', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    // ใส่แค่ให้พอระบบรันย้อนกลับได้ (ไม่จำเป็นต้องทำอะไรมากในเคสนี้)
    return Promise.resolve();
  }
};