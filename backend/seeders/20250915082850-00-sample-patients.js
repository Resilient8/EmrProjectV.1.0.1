'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('patients', [
      { prefix: 'นาย', first_name: 'สมชาย', last_name: 'ใจดี', address: '123 หมู่ 4 ต.สุขใจ อ.เมือง จ.กรุงเทพฯ 10200', patient_id: '1102004567891', birth_date: '1985-05-15', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นางสาว', first_name: 'สมหญิง', last_name: 'รักสงบ', address: '456 หมู่ 7 ต.สบายดี อ.แสนสุข จ.เชียงใหม่ 50200', patient_id: '1509900123456', birth_date: '1992-11-20', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'เด็กชาย', first_name: 'มานะ', last_name: 'เรียนดี', address: '789 หมู่ 1 ต.แม่กลอง อ.อัมพวา จ.สมุทรสงคราม 75110', patient_id: '1751100098765', birth_date: '2015-01-30', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นาย', first_name: 'ประชา', last_name: 'มีสุข', address: '101/1 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000', patient_id: '3400012345678', birth_date: '1978-07-22', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นาง', first_name: 'มานี', last_name: 'รักษ์ไทย', address: '222 หมู่ 2 ต.ป่าตอง อ.กะทู้ จ.ภูเก็ต 83150', patient_id: '3831509876543', birth_date: '1980-03-12', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นางสาว', first_name: 'อรุณี', last_name: 'เบิกบาน', address: '55/5 หมู่ 5 ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000', patient_id: '3410087654321', birth_date: '2001-09-01', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นาย', first_name: 'วิชัย', last_name: 'ก่อเกิด', address: '888 ถ.เพชรเกษม ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110', patient_id: '4901101122334', birth_date: '1965-12-08', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'เด็กหญิง', first_name: 'ปิติ', last_name: 'ยินดี', address: '321 หมู่ 3 ต.เสม็ด อ.เมือง จ.ชลบุรี 20000', patient_id: '1200002233445', birth_date: '2018-06-25', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นาย', first_name: 'เกรียงไกร', last_name: 'มุ่งมั่น', address: '44/4 หมู่ 11 ต.บางแก้ว อ.บางพลี จ.สมุทรปราการ 10540', patient_id: '1105403344556', birth_date: '1995-02-18', status: 'ยังไม่เคยรับการรักษา' },
      { prefix: 'นางสาว', first_name: 'สุดา', last_name: 'พาเพลิน', address: '191 ถ.สุขุมวิท ต.คลองเตยเหนือ อ.วัฒนา จ.กรุงเทพฯ 10110', patient_id: '1101104455667', birth_date: '1999-08-08', status: 'ยังไม่เคยรับการรักษา' }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patients', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};