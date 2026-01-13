'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ล้างข้อมูลเก่าก่อนเสมอ
    await queryInterface.bulkDelete('icd10', null, {});

    await queryInterface.bulkInsert('icd10', [
      // =======================================================
      // 🟢 กลุ่มโรคระบบทางเดินหายใจ (Respiratory) - เจอบ่อยสุด
      // =======================================================
      { code: 'J00', name_th: 'โรคหวัด / ไข้หวัดธรรมดา', name_en: 'Acute nasopharyngitis [Common cold]', is_active: true },
      { code: 'J01.9', name_th: 'ไซนัสอักเสบเฉียบพลัน', name_en: 'Acute sinusitis, unspecified', is_active: true },
      { code: 'J02.9', name_th: 'คออักเสบเฉียบพลัน', name_en: 'Acute pharyngitis, unspecified', is_active: true },
      { code: 'J03.9', name_th: 'ต่อมทอนซิลอักเสบ', name_en: 'Acute tonsillitis, unspecified', is_active: true },
      { code: 'J04.0', name_th: 'กล่องเสียงอักเสบเฉียบพลัน', name_en: 'Acute laryngitis', is_active: true },
      { code: 'J11.1', name_th: 'ไข้หวัดใหญ่ (ไม่ระบุสายพันธุ์)', name_en: 'Influenza with other respiratory manifestations', is_active: true },
      { code: 'J18.9', name_th: 'ปอดอักเสบ / ปอดบวม', name_en: 'Pneumonia, unspecified', is_active: true },
      { code: 'J20.9', name_th: 'หลอดลมอักเสบเฉียบพลัน', name_en: 'Acute bronchitis, unspecified', is_active: true },
      { code: 'J30.4', name_th: 'โรคภูมิแพ้จมูก / แพ้อากาศ', name_en: 'Allergic rhinitis, unspecified', is_active: true },
      { code: 'J45.9', name_th: 'โรคหืด (Asthma)', name_en: 'Asthma, unspecified', is_active: true },
      { code: 'U07.1', name_th: 'โรคติดเชื้อโควิด-19 (COVID-19)', name_en: 'COVID-19, virus identified', is_active: true },

      // =======================================================
      // 🟠 กลุ่มโรคทางเดินอาหาร (Gastrointestinal) - ปวดท้อง ท้องเสีย
      // =======================================================
      { code: 'A09', name_th: 'ลำไส้อักเสบติดเชื้อ / ท้องร่วง', name_en: 'Infectious gastroenteritis and colitis', is_active: true },
      { code: 'A05.9', name_th: 'อาหารเป็นพิษ', name_en: 'Bacterial foodborne intoxication', is_active: true },
      { code: 'K21.9', name_th: 'โรคกรดไหลย้อน (GERD)', name_en: 'Gastro-esophageal reflux disease', is_active: true },
      { code: 'K29.7', name_th: 'โรคกระเพาะอาหารอักเสบ', name_en: 'Gastritis, unspecified', is_active: true },
      { code: 'K30', name_th: 'อาหารไม่ย่อย / จุกเสียดแน่นท้อง', name_en: 'Functional dyspepsia', is_active: true },
      { code: 'K59.0', name_th: 'อาการท้องผูก', name_en: 'Constipation', is_active: true },
      { code: 'R10.1', name_th: 'ปวดท้องส่วนบน (ลิ้นปี่)', name_en: 'Pain localized to upper abdomen', is_active: true },
      { code: 'R10.4', name_th: 'ปวดท้อง (ไม่ระบุตำแหน่ง)', name_en: 'Other and unspecified abdominal pain', is_active: true },
      { code: 'R11', name_th: 'คลื่นไส้และอาเจียน', name_en: 'Nausea and vomiting', is_active: true },
      { code: 'K64.9', name_th: 'ริดสีดวงทวาร', name_en: 'Hemorrhoids, unspecified', is_active: true },

      // =======================================================
      // 🔵 กลุ่มโรคเรื้อรังและเมตาบอลิก (NCDs & Metabolic)
      // =======================================================
      { code: 'I10', name_th: 'ความดันโลหิตสูง', name_en: 'Essential (primary) hypertension', is_active: true },
      { code: 'E11.9', name_th: 'เบาหวานชนิดที่ 2', name_en: 'Type 2 diabetes mellitus', is_active: true },
      { code: 'E78.0', name_th: 'คอเลสเตอรอลในเลือดสูง', name_en: 'Pure hypercholesterolemia', is_active: true },
      { code: 'E78.5', name_th: 'ไขมันในเลือดสูง (รวมๆ)', name_en: 'Hyperlipidemia, unspecified', is_active: true },
      { code: 'E79.0', name_th: 'กรดยูริกในเลือดสูง (ไม่แสดงอาการ)', name_en: 'Hyperuricemia without signs of inflammatory arthritis', is_active: true },
      { code: 'M10.9', name_th: 'โรคเกาต์', name_en: 'Gout, unspecified', is_active: true },
      { code: 'E05.9', name_th: 'ไทรอยด์เป็นพิษ', name_en: 'Thyrotoxicosis, unspecified', is_active: true },

      // =======================================================
      // 🟣 กลุ่มอาการปวด กล้ามเนื้อ และกระดูก (Musculoskeletal)
      // =======================================================
      { code: 'M54.5', name_th: 'ปวดหลังส่วนล่าง', name_en: 'Low back pain', is_active: true },
      { code: 'M54.2', name_th: 'ปวดคอ', name_en: 'Cervicalgia', is_active: true },
      { code: 'M79.1', name_th: 'ปวดกล้ามเนื้อ / ออฟฟิศซินโดรม', name_en: 'Myalgia (Myofascial pain syndrome)', is_active: true },
      { code: 'M65.9', name_th: 'เอ็นอักเสบ', name_en: 'Synovitis and tenosynovitis', is_active: true },
      { code: 'M79.0', name_th: 'รูมาตอยด์ (ไม่ระบุ)', name_en: 'Rheumatism, unspecified', is_active: true },
      { code: 'M17.9', name_th: 'ข้อเข่าเสื่อม', name_en: 'Gonarthrosis, unspecified', is_active: true },
      { code: 'M77.1', name_th: 'เอ็นข้อศอกด้านนอกอักเสบ (Tennis elbow)', name_en: 'Lateral epicondylitis', is_active: true },
      { code: 'M62.6', name_th: 'กล้ามเนื้อเคล็ดขัดยอก', name_en: 'Muscle strain', is_active: true },

      // =======================================================
      // 🧠 กลุ่มระบบประสาท (Neurology)
      // =======================================================
      { code: 'R51', name_th: 'ปวดศีรษะ (ไม่ระบุสาเหตุ)', name_en: 'Headache', is_active: true },
      { code: 'G43.9', name_th: 'ไมเกรน', name_en: 'Migraine, unspecified', is_active: true },
      { code: 'G44.2', name_th: 'ปวดศีรษะจากความเครียด', name_en: 'Tension-type headache', is_active: true },
      { code: 'H81.1', name_th: 'เวียนศีรษะบ้านหมุน (BPPV)', name_en: 'Benign paroxysmal vertigo', is_active: true },
      { code: 'R42', name_th: 'เวียนศีรษะ มึนงง', name_en: 'Dizziness and giddiness', is_active: true },
      { code: 'G47.0', name_th: 'นอนไม่หลับ (Insomnia)', name_en: 'Disorders of initiating and maintaining sleep', is_active: true },

      // =======================================================
      // 🌸 กลุ่มโรคผิวหนัง (Dermatology)
      // =======================================================
      { code: 'L20.9', name_th: 'ผื่นภูมิแพ้ผิวหนัง', name_en: 'Atopic dermatitis, unspecified', is_active: true },
      { code: 'L50.9', name_th: 'ลมพิษ', name_en: 'Urticaria, unspecified', is_active: true },
      { code: 'L23.9', name_th: 'ผื่นแพ้สัมผัส', name_en: 'Allergic contact dermatitis', is_active: true },
      { code: 'B35.4', name_th: 'เกลื้อน', name_en: 'Tinea corporis', is_active: true },
      { code: 'B35.3', name_th: 'น้ำกัดเท้า (ฮ่องกงฟุต)', name_en: 'Tinea pedis', is_active: true },
      { code: 'L70.0', name_th: 'สิว', name_en: 'Acne vulgaris', is_active: true },
      { code: 'B02.9', name_th: 'งูสวัด', name_en: 'Zoster without complication', is_active: true },
      { code: 'B01.9', name_th: 'อีสุกอีใส', name_en: 'Varicella without complication', is_active: true },
      { code: 'L03.9', name_th: 'แผลอักเสบติดเชื้อ / เซลล์เนื้อเยื่ออักเสบ', name_en: 'Cellulitis, unspecified', is_active: true },

      // =======================================================
      // 👁️👂 กลุ่มตา หู คอ จมูก (Eye, Ear, ENT)
      // =======================================================
      { code: 'H10.9', name_th: 'ตาแดง / เยื่อบุตาอักเสบ', name_en: 'Conjunctivitis, unspecified', is_active: true },
      { code: 'H00.0', name_th: 'ตากุ้งยิง', name_en: 'Hordeolum and other deep inflammation of eyelid', is_active: true },
      { code: 'H60.9', name_th: 'หูชั้นนอกอักเสบ', name_en: 'Otitis externa, unspecified', is_active: true },
      { code: 'H66.9', name_th: 'หูชั้นกลางอักเสบ', name_en: 'Otitis media, unspecified', is_active: true },
      { code: 'H93.1', name_th: 'เสียงในหู', name_en: 'Tinnitus', is_active: true },
      { code: 'R04.0', name_th: 'เลือดกำเดาไหล', name_en: 'Epistaxis', is_active: true },

      // =======================================================
      // 🚽 กลุ่มระบบทางเดินปัสสาวะ (Genitourinary)
      // =======================================================
      { code: 'N30.9', name_th: 'กระเพาะปัสสาวะอักเสบ', name_en: 'Cystitis, unspecified', is_active: true },
      { code: 'N39.0', name_th: 'ติดเชื้อทางเดินปัสสาวะ (UTI)', name_en: 'Urinary tract infection, site not specified', is_active: true },
      { code: 'N20.9', name_th: 'นิ่วในระบบทางเดินปัสสาวะ', name_en: 'Urinary calculus, unspecified', is_active: true },
      { code: 'N94.6', name_th: 'ปวดประจำเดือน', name_en: 'Dysmenorrhea, unspecified', is_active: true },

      // =======================================================
      // 🚑 อุบัติเหตุและอื่นๆ (Trauma & Others)
      // =======================================================
      { code: 'T14.0', name_th: 'แผลถลอก / บาดเจ็บตื้นๆ', name_en: 'Superficial injury of unspecified body region', is_active: true },
      { code: 'T14.1', name_th: 'แผลเปิด (แผลฉีกขาด/มีดบาด)', name_en: 'Open wound of unspecified body region', is_active: true },
      { code: 'W54.0', name_th: 'สุนัขกัด', name_en: 'Bitten by dog', is_active: true },
      { code: 'W55.0', name_th: 'แมวข่วน / แมวกัด', name_en: 'Bitten or struck by cat', is_active: true },
      { code: 'L02.9', name_th: 'ฝี (Abscess)', name_en: 'Cutaneous abscess, furuncle and carbuncle', is_active: true },
      { code: 'R50.9', name_th: 'ไข้ (ไม่ระบุสาเหตุ)', name_en: 'Fever, unspecified', is_active: true },
      { code: 'R53', name_th: 'อ่อนเพลีย / ไม่มีแรง', name_en: 'Malaise and fatigue', is_active: true },
      { code: 'R63.0', name_th: 'เบื่ออาหาร', name_en: 'Anorexia', is_active: true },
      { code: 'Z00.0', name_th: 'ตรวจร่างกายทั่วไป (Check-up)', name_en: 'General medical examination', is_active: true },
      { code: 'Z02.5', name_th: 'ขอใบรับรองแพทย์ (กีฬา)', name_en: 'Examination for participation in sport', is_active: true },
      { code: 'Z02.7', name_th: 'ขอใบรับรองแพทย์ (ใบขับขี่/สมัครงาน)', name_en: 'Issue of medical certificate', is_active: true }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('icd10', null, {});
  }
};