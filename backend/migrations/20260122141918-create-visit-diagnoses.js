'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('visit_diagnoses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'visits',
          key: 'visit_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // 🔥🔥🔥 จุดที่แก้ไขครับ 🔥🔥🔥
      icd10_code: {  // 1. เปลี่ยนชื่อเป็น code
        type: Sequelize.STRING, // 2. เปลี่ยน Type เป็น String ตาม Model ICD10
        allowNull: false,
        references: {
          model: 'icd10', // ชื่อตาราง
          key: 'code'     // 3. ชี้ไปที่ 'code' (PK ของ ICD10)
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // 🔥🔥🔥 จบจุดที่แก้ไข 🔥🔥🔥
      diagnosis_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'PRINCIPAL'
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('visit_diagnoses');
  }
};