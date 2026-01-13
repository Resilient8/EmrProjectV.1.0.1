'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prescriptions', {
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
          model: 'Visits', // ตรวจสอบว่าชื่อตาราง Visits ใน DB เป็นตัวพิมพ์ใหญ่หรือเล็ก (ส่วนใหญ่ถ้าตาม Model ของคุณจะเป็น Visits)
          key: 'visit_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      drug_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'medications', // ตามชื่อตารางใน Migration medications
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      drug_name: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.STRING
      },
      dosage: {
        type: Sequelize.STRING
      },
      instruction: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prescriptions');
  }
};