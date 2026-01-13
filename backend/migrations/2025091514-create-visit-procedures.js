'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisitProcedures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 1. แก้ไขให้ชี้ไปที่ 'visit_id' (ตาม Error แรก)
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Visits', key: 'visit_id' }, 
        onDelete: 'CASCADE'
      },
      // 2. แก้ไขให้ชี้ไปที่ 'id' (เพราะ services ใช้ id ปกติ)
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'services', key: 'id' },
        onDelete: 'SET NULL'
      },
      // 3. แก้ไขให้ชี้ไปที่ 'procedure_id' (ตาม Error ล่าสุด)
      procedure_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'procedures', key: 'procedure_id' },
        onDelete: 'SET NULL'
      },
      // 4. คาดว่า diagnoses น่าจะใช้ 'id' (ถ้า Error อีกให้แก้เป็น diagnosis_id)
      diagnosis_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'diagnoses', key: 'id' },
        onDelete: 'SET NULL'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VisitProcedures');
  }
};