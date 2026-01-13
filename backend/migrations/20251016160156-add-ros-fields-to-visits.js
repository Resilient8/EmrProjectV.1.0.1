'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Visits', 'PresentIllness', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Visits', 'ROS_General', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Visits', 'ROS_HeadAndNeck', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Visits', 'ROS_Respiratory', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Visits', 'ROS_Cardiovascular', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Visits', 'ROS_Gastrointestinal', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Visits', 'ROS_Skin', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Visits', 'PresentIllness');
    await queryInterface.removeColumn('Visits', 'ROS_General');
    await queryInterface.removeColumn('Visits', 'ROS_HeadAndNeck');
    await queryInterface.removeColumn('Visits', 'ROS_Respiratory');
    await queryInterface.removeColumn('Visits', 'ROS_Cardiovascular');
    await queryInterface.removeColumn('Visits', 'ROS_Gastrointestinal');
    await queryInterface.removeColumn('Visits', 'ROS_Skin');
  }
};