'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisitSymptoms', {
      visit_symptom_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Visits', // ชื่อตาราง Visits
          key: 'visit_id'
        },
        onDelete: 'CASCADE'
      },
      symptom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'symptoms', // ชื่อตาราง symptoms
          key: 'symptom_id'
        },
        onDelete: 'CASCADE'
      },
      duration: { type: Sequelize.STRING, allowNull: true },
      level: { type: Sequelize.STRING, allowNull: true },
      details: { type: Sequelize.TEXT, allowNull: true },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VisitSymptoms');
  }
};