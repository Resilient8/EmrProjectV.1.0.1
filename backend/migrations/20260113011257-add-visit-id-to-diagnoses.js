'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ขั้นตอนที่ 1: เพิ่มคอลัมน์แบบยอมรับค่า NULL (allowNull: true)
    await queryInterface.addColumn('diagnoses', 'visit_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // 🔥 เปลี่ยนเป็น true เพื่อให้ข้อมูลเดิมอยู่ได้
      references: {
        model: 'visits',
        key: 'visit_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      after: 'id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('diagnoses', 'visit_id');
  }
};