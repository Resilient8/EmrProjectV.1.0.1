'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. หมอ (Doctor) -> 'อายุรกรรม (OPD)'
    await queryInterface.sequelize.query(
      `UPDATE users SET department = 'อายุรกรรม (OPD)' WHERE role = 'Doctor' AND (department IS NULL OR department = '')`
    );

    // 2. พยาบาล (Nurse) -> 'แผนกผู้ป่วยนอก'
    await queryInterface.sequelize.query(
      `UPDATE users SET department = 'แผนกผู้ป่วยนอก' WHERE role = 'Nurse' AND (department IS NULL OR department = '')`
    );

    // 3. เภสัชกร (Pharmacist) -> 'ห้องจ่ายยา'
    await queryInterface.sequelize.query(
      `UPDATE users SET department = 'ห้องจ่ายยา' WHERE role = 'Pharmacist' AND (department IS NULL OR department = '')`
    );

    // 4. Admin -> 'IT / Admin'
    await queryInterface.sequelize.query(
      `UPDATE users SET department = 'IT / Admin' WHERE role = 'Admin' AND (department IS NULL OR department = '')`
    );
  },

  async down (queryInterface, Sequelize) {
    // ถ้า Undo ให้ล้างค่ากลับเป็น NULL
    await queryInterface.sequelize.query(
      `UPDATE users SET department = NULL`
    );
  }
};