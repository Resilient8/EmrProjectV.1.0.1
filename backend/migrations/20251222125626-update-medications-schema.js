'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'medications';
    
    // 1. อ่านข้อมูลตารางปัจจุบันมาก่อนว่ามีคอลัมน์อะไรบ้าง
    const tableInfo = await queryInterface.describeTable(tableName);

    // 2. เช็คทีละตัว ถ้ายังไม่มีค่อยสร้าง (Prevent Duplicate Error)
    
    if (!tableInfo['dosage']) {
      await queryInterface.addColumn(tableName, 'dosage', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo['dosage_form']) {
      await queryInterface.addColumn(tableName, 'dosage_form', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo['unit']) {
      await queryInterface.addColumn(tableName, 'unit', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo['instructions']) {
      await queryInterface.addColumn(tableName, 'instructions', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableInfo['is_active']) {
      await queryInterface.addColumn(tableName, 'is_active', {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      });
    }

    // 3. ปรับปรุง column price (ถ้ามีอยู่แล้วก็แก้ Type ได้เลย)
    if (tableInfo['price']) {
      try {
        await queryInterface.changeColumn(tableName, 'price', {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0
        });
      } catch (e) {
        console.log('Skipping price change if already correct');
      }
    }
  },

  async down (queryInterface, Sequelize) {
    const tableName = 'medications';
    const tableInfo = await queryInterface.describeTable(tableName);

    // ตอนถอยกลับ ก็เช็คก่อนลบเหมือนกัน กัน Error
    if (tableInfo['dosage']) await queryInterface.removeColumn(tableName, 'dosage');
    if (tableInfo['dosage_form']) await queryInterface.removeColumn(tableName, 'dosage_form');
    if (tableInfo['unit']) await queryInterface.removeColumn(tableName, 'unit');
    if (tableInfo['instructions']) await queryInterface.removeColumn(tableName, 'instructions');
    if (tableInfo['is_active']) await queryInterface.removeColumn(tableName, 'is_active');
  }
};