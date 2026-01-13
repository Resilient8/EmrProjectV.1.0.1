'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('patients', 'blood_group', {
        type: Sequelize.STRING(10),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('patients', 'underlying_disease', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('patients', 'drug_allergies', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('patients', 'food_allergies', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('patients', 'blood_group', { transaction });
      await queryInterface.removeColumn('patients', 'underlying_disease', { transaction });
      await queryInterface.removeColumn('patients', 'drug_allergies', { transaction });
      await queryInterface.removeColumn('patients', 'food_allergies', { transaction });
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};