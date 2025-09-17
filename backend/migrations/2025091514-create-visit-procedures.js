'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisitProcedures', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Visits', key: 'visit_id' },
        onDelete: 'CASCADE'
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'services', key: 'service_id' },
        onDelete: 'SET NULL'
      },
      procedure_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'procedures', key: 'procedure_id' },
        onDelete: 'SET NULL'
      },
      diagnosis_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'diagnosis', key: 'diagnosis_id' }, // <-- แก้ไขตรงนี้ (ไม่มี s)
        onDelete: 'SET NULL'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VisitProcedures');
  }
};