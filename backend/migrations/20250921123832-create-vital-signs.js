'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vital_signs', {
      vitals_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Visits', // <--- แก้ไขตรงนี้ให้เป็น V พิมพ์ใหญ่
          key: 'visit_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      temperature: {
        type: Sequelize.DECIMAL(4, 1)
      },
      pulse: {
        type: Sequelize.INTEGER
      },
      respiration: {
        type: Sequelize.INTEGER
      },
      blood_pressure: {
        type: Sequelize.STRING(10)
      },
      height: {
        type: Sequelize.DECIMAL(5, 1)
      },
      weight: {
        type: Sequelize.DECIMAL(5, 1)
      },
      bmi: {
        type: Sequelize.DECIMAL(4, 2)
      },
      waist_circumference: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vital_signs');
  }
};