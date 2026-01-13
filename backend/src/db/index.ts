import { Sequelize } from 'sequelize';
import sequelize from './sequelize';

// ===================================================
// 1. Import Models ทั้งหมด
// ===================================================
import User from '../models/user';
import Patient from '../models/patient';
import Visit from '../models/visits';
import VitalSign from '../models/vitalSigns';
import Symptom from '../models/symptom';
import VisitSymptom from '../models/visitSymptoms';
import Diagnosis from '../models/diagnosis';
import VisitProcedure from '../models/visitProcedures';
import Service from '../models/services';
import Procedure from '../models/procedure';
import Department from '../models/department';
import Doctor from '../models/doctor';
import Nurse from '../models/nurses';
import Pharmacist from '../models/pharmacist';
import Category from '../models/category';
import Product from '../models/product';
import Medication from '../models/medications'; 
import Prescription from '../models/prescription';
import ICD10 from '../models/icd10'; 

// ===================================================
// 2. รวม Model เข้า object db
// ===================================================
const db: any = {
  sequelize,
  Sequelize,
  User,
  Patient,
  Visit,
  VitalSign,
  Symptom,
  VisitSymptom,
  Diagnosis,
  VisitProcedure, 
  Service,
  Procedure,
  Department,
  Doctor,
  Nurse,
  Pharmacist,
  Category,
  Product,
  Medication,
  Prescription,
  ICD10
};

// ===================================================
// 3. สั่ง Associate (เรียกฟังก์ชันที่เขียนไว้ในไฟล์ Model)
// ===================================================
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ===================================================
// 🔥 4. MANUAL ASSOCIATIONS (จุดชี้เป็นชี้ตาย)
// ===================================================

// --- 4.1 เคลียร์เรื่องชื่อ recordedBy ที่ชนกัน ---
// ถ้าในไฟล์ Model มีการเขียน as: 'recordedBy' อยู่แล้ว บรรทัดข้างล่างนี้จะข้ามไปไม่ error
try {
    if (!Visit.associations.recordedBy) {
        Visit.belongsTo(User, { as: 'recordedBy', foreignKey: 'recorder_id' });
    }
} catch (e) { console.log("Visit association already exists"); }

// --- 4.2 ตารางยา (ต้องใช้ drug_id เท่านั้น) ---
try {
    // ลบอันเดิมที่อาจจะค้างอยู่ แล้วประกาศใหม่ให้เคลียร์
    Prescription.belongsTo(Product, { foreignKey: 'drug_id', as: 'product' });
    Product.hasMany(Prescription, { foreignKey: 'drug_id', as: 'productPrescriptions' });
    
    // Alias สำหรับคนสั่งยา (เภสัชกรใช้ชื่อนี้)
    Prescription.belongsTo(User, { as: 'prescribedBy', foreignKey: 'prescribed_by' });
} catch (e) { console.log("Prescription associations already exist"); }

// --- 4.3 ตารางอื่นๆ (ใช้ชื่อเฉพาะทางเพื่อไม่ให้ซ้ำ) ---
try {
    VitalSign.belongsTo(User, { as: 'vitalsRecorder', foreignKey: 'recorded_by' });
    VisitSymptom.belongsTo(User, { as: 'symptomRecorder', foreignKey: 'recorded_by' });
} catch (e) { console.log("Other associations already exist"); }

export default db;