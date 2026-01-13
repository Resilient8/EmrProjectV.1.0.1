'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Visits', 'referral_department', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('Visits', 'referral_doctor', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('Visits', 'referral_notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Visits', 'referral_department');
    await queryInterface.removeColumn('Visits', 'referral_doctor');
    await queryInterface.removeColumn('Visits', 'referral_notes');
  }
};