'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // ฟังก์ชัน up เราจะไม่ใช้ ให้ปล่อยว่างไว้
  async up (queryInterface, Sequelize) {},

  // ฟังก์ชัน down จะเป็น 'มาสเตอร์คีย์' ของเรา
  async down (queryInterface, Sequelize) {
    const tableNames = [
      // ใส่ชื่อตารางทั้งหมดของคุณที่นี่ (ตารางลูกอยู่บน)
      'VisitSymptoms',
      'VisitProcedures',
      'medications',
      'Visits',
      'doctors',
      'nurses',
      'pharmacists',
      'users',
      'patients',
      'products',
      'categories',
      'departments',
      'diagnoses',
      'procedures',
      'services',
      'symptoms',
    ];

    // ใช้ Transaction เพื่อความปลอดภัย
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // ปิดการตรวจสอบ Foreign Key
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });

      // วนลูป Truncate ทุกตาราง
      for (const tableName of tableNames) {
        await queryInterface.sequelize.query(`TRUNCATE TABLE \`${tableName}\`;`, { transaction });
      }

      // เปิดการตรวจสอบ Foreign Key กลับมาเหมือนเดิม
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};