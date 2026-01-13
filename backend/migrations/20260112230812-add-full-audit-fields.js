'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const auditField = {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    };

    // 1-3. ข้ามบรรทัดที่รันผ่านไปแล้ว (recorder_id, doctor_id, recorded_by ใน VitalSigns)
    // await queryInterface.addColumn('visits', 'recorder_id', auditField); 
    // await queryInterface.addColumn('Diagnoses', 'doctor_id', auditField); 
    // await queryInterface.addColumn('VitalSigns', 'recorded_by', auditField); 

    // 🚩 4. ตารางซักประวัติ (แก้ให้ตรงกับ Model VisitSymptom.ts)
    await queryInterface.addColumn('VisitSymptoms', 'recorded_by', auditField); 

    // 🚩 5. ตารางหัตถการ (คาดว่าน่าจะเป็น 'VisitProcedures')
    await queryInterface.addColumn('VisitProcedures', 'recorded_by', auditField);

    // 🚩 6. ตารางยา (คาดว่าน่าจะเป็น 'Prescriptions')
    await queryInterface.addColumn('Prescriptions', 'prescribed_by', auditField);
  },

  async down(queryInterface, Sequelize) {
    // ส่วน down...
  }
};