'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Visits', { // <-- ใช้ชื่อ 'Visits' (ตัวใหญ่) ตามใน Model
      visit_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'patients', // อ้างอิงถึงตาราง patients
          key: 'patient_id',
        },
        onDelete: 'CASCADE' // ถ้าผู้ป่วยถูกลบ, visit ทั้งหมดของผู้นั้นก็จะถูกลบไปด้วย
      },
      UserID: { // Sequelize มักจะแปลงเป็นตัวเล็ก (userid) แต่เรากำหนดให้ตรง Model
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // อ้างอิงถึงตาราง users
          key: 'user_id',
        },
        onDelete: 'SET NULL' // ถ้า user ผู้บันทึกถูกลบ, ให้ค่านี้เป็น NULL แต่ยังเก็บ visit ไว้
      },
      visit_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      temperature: { type: Sequelize.DECIMAL(4, 1), allowNull: true },
      pulse: { type: Sequelize.INTEGER, allowNull: true },
      respiration: { type: Sequelize.INTEGER, allowNull: true },
      blood_pressure: { type: Sequelize.STRING(20), allowNull: true },
      height: { type: Sequelize.DECIMAL(5, 1), allowNull: true },
      weight: { type: Sequelize.DECIMAL(5, 1), allowNull: true },
      bmi: { type: Sequelize.DECIMAL(4, 2), allowNull: true },
      waist_circumference: { type: Sequelize.DECIMAL(5, 1), allowNull: true },
      allergies: { type: Sequelize.TEXT, allowNull: true },
      underlying_diseases: { type: Sequelize.TEXT, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Visits');
  }
};