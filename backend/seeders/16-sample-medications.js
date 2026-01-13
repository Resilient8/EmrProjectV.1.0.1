'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ลบข้อมูลเก่าก่อนเพื่อป้องกัน ID ชนกัน หรือข้อมูลซ้ำ
    await queryInterface.bulkDelete('medications', null, {});

    const now = new Date();

    await queryInterface.bulkInsert('medications', [
      // -----------------------------------------------------------
      // 🔴 1. กลุ่มแก้ปวด ลดไข้ ต้านการอักเสบ (Pain & Fever)
      // -----------------------------------------------------------
      { 
        medication_code: 'D001', generic_name: 'Paracetamol', trade_name: 'Sara', 
        dosage: '500 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 1.5, stock_quantity: 1000, 
        instructions: 'รับประทานครั้งละ 1-2 เม็ด เวลาปวดหรือมีไข้ ห่างกันทุก 4-6 ชม.', is_active: true 
      },
      { 
        medication_code: 'D002', generic_name: 'Paracetamol Syrup', trade_name: 'Sara Kids', 
        dosage: '120 mg/5ml', dosage_form: 'Syrup', unit: 'ขวด', price: 45.0, stock_quantity: 100, 
        instructions: 'รับประทานตามน้ำหนักตัว เวลาปวดหรือมีไข้', is_active: true 
      },
      { 
        medication_code: 'D003', generic_name: 'Ibuprofen', trade_name: 'Brufen', 
        dosage: '400 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 3.0, stock_quantity: 500, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหารทันที (ระวังกัดกระเพาะ)', is_active: true 
      },
      { 
        medication_code: 'D004', generic_name: 'Diclofenac', trade_name: 'Voltaren', 
        dosage: '25 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 2.5, stock_quantity: 300, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-เย็น', is_active: true 
      },
      { 
        medication_code: 'D005', generic_name: 'Tramadol', trade_name: 'Tramal', 
        dosage: '50 mg', dosage_form: 'Capsule', unit: 'เม็ด', price: 5.0, stock_quantity: 200, 
        instructions: 'รับประทานครั้งละ 1 เม็ด เวลาปวดรุนแรง', is_active: true 
      },
      { 
        medication_code: 'D006', generic_name: 'Mefenamic Acid', trade_name: 'Ponstan', 
        dosage: '500 mg', dosage_form: 'Capsule', unit: 'เม็ด', price: 4.0, stock_quantity: 200, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร (แก้ปวดประจำเดือน)', is_active: true 
      },

      // -----------------------------------------------------------
      // 🟠 2. กลุ่มยาฆ่าเชื้อ/ปฏิชีวนะ (Antibiotics)
      // -----------------------------------------------------------
      { 
        medication_code: 'A001', generic_name: 'Amoxicillin', trade_name: 'Amoxil', 
        dosage: '500 mg', dosage_form: 'Capsule', unit: 'เม็ด', price: 3.0, stock_quantity: 800, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนอาหาร เช้า-กลางวัน-เย็น-ก่อนนอน', is_active: true 
      },
      { 
        medication_code: 'A002', generic_name: 'Amoxicillin/Clavulanate', trade_name: 'Augmentin', 
        dosage: '1000 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 25.0, stock_quantity: 100, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-เย็น ติดต่อกัน 7 วัน', is_active: true 
      },
      { 
        medication_code: 'A003', generic_name: 'Norfloxacin', trade_name: 'Norflox', 
        dosage: '400 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 4.0, stock_quantity: 300, 
        instructions: 'รับประทานครั้งละ 1 เม็ด เช้า-เย็น (แก้ท้องเสียติดเชื้อ/กระเพาะปัสสาวะอักเสบ)', is_active: true 
      },
      { 
        medication_code: 'A004', generic_name: 'Azithromycin', trade_name: 'Zithromax', 
        dosage: '250 mg', dosage_form: 'Capsule', unit: 'เม็ด', price: 35.0, stock_quantity: 100, 
        instructions: 'รับประทานวันละ 1 ครั้ง ก่อนอาหาร', is_active: true 
      },
      { 
        medication_code: 'A005', generic_name: 'Dicloxacillin', trade_name: 'Diclocil', 
        dosage: '500 mg', dosage_form: 'Capsule', unit: 'เม็ด', price: 4.0, stock_quantity: 400, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนอาหาร 4 เวลา (ฆ่าเชื้อผิวหนัง/แผล)', is_active: true 
      },

      // -----------------------------------------------------------
      // 🟡 3. กลุ่มแก้แพ้ ลดน้ำมูก ทางเดินหายใจ (Allergy & Respiratory)
      // -----------------------------------------------------------
      { 
        medication_code: 'R001', generic_name: 'Chlorpheniramine (CPM)', trade_name: 'CPM', 
        dosage: '4 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 0.5, stock_quantity: 2000, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (อาจทำให้ง่วง)', is_active: true 
      },
      { 
        medication_code: 'R002', generic_name: 'Cetirizine', trade_name: 'Zyrtec', 
        dosage: '10 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 5.0, stock_quantity: 500, 
        instructions: 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง ก่อนนอน', is_active: true 
      },
      { 
        medication_code: 'R003', generic_name: 'Loratadine', trade_name: 'Clarityne', 
        dosage: '10 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 6.0, stock_quantity: 500, 
        instructions: 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง', is_active: true 
      },
      { 
        medication_code: 'R004', generic_name: 'Bromhexine', trade_name: 'Bisolvon', 
        dosage: '8 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 2.0, stock_quantity: 600, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-กลางวัน-เย็น (ละลายเสมหะ)', is_active: true 
      },
      { 
        medication_code: 'R005', generic_name: 'Acetylcysteine', trade_name: 'NAC Long', 
        dosage: '600 mg', dosage_form: 'Effervescent', unit: 'เม็ดฟู่', price: 15.0, stock_quantity: 200, 
        instructions: 'ละลายน้ำดื่ม วันละ 1 ครั้ง หลังอาหารเย็น', is_active: true 
      },
      { 
        medication_code: 'R006', generic_name: 'Dextromethorphan', trade_name: 'Romilar', 
        dosage: '15 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 2.0, stock_quantity: 400, 
        instructions: 'รับประทานครั้งละ 1 เม็ด เวลาไอ', is_active: true 
      },
      { 
        medication_code: 'R007', generic_name: 'Salbutamol Inhaler', trade_name: 'Ventolin', 
        dosage: '100 mcg', dosage_form: 'Inhaler', unit: 'หลอด', price: 250.0, stock_quantity: 50, 
        instructions: 'พ่น 2 สูด เวลาหอบเหนื่อย', is_active: true 
      },

      // -----------------------------------------------------------
      // 🟢 4. กลุ่มทางเดินอาหาร (Gastrointestinal)
      // -----------------------------------------------------------
      { 
        medication_code: 'G001', generic_name: 'Omeprazole', trade_name: 'Miracid', 
        dosage: '20 mg', dosage_form: 'Capsule', unit: 'เม็ด', price: 3.0, stock_quantity: 600, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนอาหารเช้า 30 นาที', is_active: true 
      },
      { 
        medication_code: 'G002', generic_name: 'Simethicone', trade_name: 'Air-X', 
        dosage: '80 mg', dosage_form: 'Chewable', unit: 'เม็ด', price: 2.0, stock_quantity: 800, 
        instructions: 'เคี้ยวครั้งละ 1-2 เม็ด เวลาท้องอืด แน่นท้อง', is_active: true 
      },
      { 
        medication_code: 'G003', generic_name: 'Domperidone', trade_name: 'Motilium', 
        dosage: '10 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 2.5, stock_quantity: 400, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนอาหาร (แก้คลื่นไส้ อาเจียน)', is_active: true 
      },
      { 
        medication_code: 'G004', generic_name: 'Hyoscine', trade_name: 'Buscopan', 
        dosage: '10 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 3.5, stock_quantity: 300, 
        instructions: 'รับประทานครั้งละ 1 เม็ด เวลาปวดเกร็งท้อง', is_active: true 
      },
      { 
        medication_code: 'G005', generic_name: 'ORS Powder', trade_name: 'Oreda', 
        dosage: '1 ซอง', dosage_form: 'Powder', unit: 'ซอง', price: 5.0, stock_quantity: 1000, 
        instructions: 'จิบเรื่อยๆ แทนน้ำ เมื่อมีอาการท้องเสีย', is_active: true 
      },
      { 
        medication_code: 'G006', generic_name: 'Activated Charcoal', trade_name: 'Ultracarbon', 
        dosage: '250 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 4.0, stock_quantity: 200, 
        instructions: 'รับประทานครั้งละ 2-4 เม็ด (ดูดซับสารพิษ/แก้ท้องเสีย)', is_active: true 
      },

      // -----------------------------------------------------------
      // 🔵 5. กลุ่มโรคเรื้อรัง (NCDs: เบาหวาน/ความดัน/ไขมัน)
      // -----------------------------------------------------------
      { 
        medication_code: 'N001', generic_name: 'Amlodipine', trade_name: 'Norvasc', 
        dosage: '5 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 2.0, stock_quantity: 1000, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหารเช้า (ลดความดัน)', is_active: true 
      },
      { 
        medication_code: 'N002', generic_name: 'Enalapril', trade_name: 'Enaril', 
        dosage: '5 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 1.5, stock_quantity: 500, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหารเช้า', is_active: true 
      },
      { 
        medication_code: 'N003', generic_name: 'Metformin', trade_name: 'Glucophage', 
        dosage: '500 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 1.5, stock_quantity: 1000, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-เย็น (ลดน้ำตาล)', is_active: true 
      },
      { 
        medication_code: 'N004', generic_name: 'Glipizide', trade_name: 'Minidiab', 
        dosage: '5 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 2.0, stock_quantity: 500, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนอาหารเช้า', is_active: true 
      },
      { 
        medication_code: 'N005', generic_name: 'Simvastatin', trade_name: 'Zocor', 
        dosage: '20 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 3.0, stock_quantity: 600, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนนอน (ลดไขมัน)', is_active: true 
      },
      { 
        medication_code: 'N006', generic_name: 'Atorvastatin', trade_name: 'Lipitor', 
        dosage: '40 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 15.0, stock_quantity: 300, 
        instructions: 'รับประทานครั้งละ 1 เม็ด ก่อนนอน', is_active: true 
      },
      { 
        medication_code: 'N007', generic_name: 'Aspirin (Baby)', trade_name: 'Aspent', 
        dosage: '81 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 1.0, stock_quantity: 500, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหารเช้า (ต้านเกล็ดเลือด)', is_active: true 
      },

      // -----------------------------------------------------------
      // 🟣 6. ยาใช้ภายนอกและอื่นๆ (Topical & Others)
      // -----------------------------------------------------------
      { 
        medication_code: 'T001', generic_name: 'Betamethasone Cream', trade_name: 'Betnovate', 
        dosage: '15 g', dosage_form: 'Cream', unit: 'หลอด', price: 80.0, stock_quantity: 100, 
        instructions: 'ทาบริเวณที่เป็น วันละ 2 ครั้ง เช้า-เย็น (แก้แพ้/คัน)', is_active: true 
      },
      { 
        medication_code: 'T002', generic_name: 'Clotrimazole Cream', trade_name: 'Canesten', 
        dosage: '10 g', dosage_form: 'Cream', unit: 'หลอด', price: 65.0, stock_quantity: 100, 
        instructions: 'ทาบริเวณที่เป็นเชื้อรา วันละ 2 ครั้ง เช้า-เย็น', is_active: true 
      },
      { 
        medication_code: 'T003', generic_name: 'Silver Sulfadiazine', trade_name: 'Silvex', 
        dosage: '25 g', dosage_form: 'Cream', unit: 'กระปุก', price: 50.0, stock_quantity: 50, 
        instructions: 'ทาแผลไฟไหม้ น้ำร้อนลวก', is_active: true 
      },
      { 
        medication_code: 'T004', generic_name: 'Methyl Salicylate', trade_name: 'Counterpain', 
        dosage: '60 g', dosage_form: 'Gel', unit: 'หลอด', price: 90.0, stock_quantity: 80, 
        instructions: 'ทาถูนวด บรรเทาอาการปวดกล้ามเนื้อ', is_active: true 
      },
      { 
        medication_code: 'T005', generic_name: 'Povidone Iodine', trade_name: 'Betadine', 
        dosage: '30 ml', dosage_form: 'Solution', unit: 'ขวด', price: 30.0, stock_quantity: 100, 
        instructions: 'ใส่แผลสด ฆ่าเชื้อโรค', is_active: true 
      },
      { 
        medication_code: 'V001', generic_name: 'Vitamin C', trade_name: 'Nat C', 
        dosage: '1000 mg', dosage_form: 'Tablet', unit: 'เม็ด', price: 5.0, stock_quantity: 200, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหารเช้า', is_active: true 
      },
      { 
        medication_code: 'V002', generic_name: 'Vitamin B Complex', trade_name: 'Neurobion', 
        dosage: '-', dosage_form: 'Tablet', unit: 'เม็ด', price: 4.0, stock_quantity: 300, 
        instructions: 'รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-เย็น (บำรุงปลายประสาท)', is_active: true 
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('medications', null, {});
  }
};