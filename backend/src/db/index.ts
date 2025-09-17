// src/db/index.ts (Final Corrected Version)

import { Sequelize } from 'sequelize';
import sequelize from './sequelize'; // <-- Import ตัวเชื่อมต่อที่สร้างไว้แล้วเข้ามา

// ----- 1. Import ทุก Model เข้ามา -----
import User from '../models/user';
import Patient from '../models/patient';
import Visit from '../models/visits';
import Symptom from '../models/symptom';
import VisitSymptom from '../models/visitSymptoms';
import Procedure from '../models/procedure';
import VisitProcedure from '../models/visitProcedures';
import Service from '../models/services';
import Department from '../models/department';
import Doctor from '../models/doctor';
import Pharmacist from '../models/pharmacist';
import Diagnosis from '../models/diagnosis';
import Category from '../models/category';
import Product from '../models/product';


// ----- 2. สร้าง db object เพื่อรวบรวมทุกอย่าง -----
const db: any = {};
db.sequelize = sequelize; // ใช้ sequelize ที่ import เข้ามา
db.Sequelize = Sequelize;

db.User = User;
db.Patient = Patient;
db.Visit = Visit;
db.Symptom = Symptom;
db.VisitSymptom = VisitSymptom;
db.Procedure = Procedure;
db.VisitProcedure = VisitProcedure;
db.Service = Service;
db.Department = Department;
db.Doctor = Doctor;
db.Pharmacist = Pharmacist;
db.Diagnosis = Diagnosis;
db.Category = Category;
db.Product = Product;


// ----- 3. ใช้ Loop สร้างความสัมพันธ์อัตโนมัติ -----
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// ----- 4. Export db object ที่มีทุกอย่างออกไป -----
export default db;