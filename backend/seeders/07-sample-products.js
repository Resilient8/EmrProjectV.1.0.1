'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      // 🛑 [แก้ไข] ลบคอลัมน์ createdAt และ updatedAt ออกจากทุกแถว
      { product_name: 'Paracetamol 500mg (แผง)', price: 15.00, category_id: 1 },
      { product_name: 'Ibuprofen 400mg (แผง)', price: 25.00, category_id: 1 },
      { product_name: 'Amoxicillin 500mg (แผง)', price: 50.00, category_id: 2 },
      { product_name: 'Cetirizine 10mg (แผง)', price: 30.00, category_id: 3 },
      { product_name: 'ผ้าก๊อซ 3x3 นิ้ว (แพ็ค)', price: 20.00, category_id: 5 },
      { product_name: 'พลาสเตอร์ยา (กล่อง)', price: 15.00, category_id: 5 },
      { product_name: 'น้ำเกลือล้างแผล 100ml', price: 25.00, category_id: 5 },
      { product_name: 'Vitamin C 1000mg (ขวด)', price: 150.00, category_id: 6 },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};