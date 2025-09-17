"use strict";
// src/db/index.ts (Final Corrected Version)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("./sequelize")); // <-- Import ตัวเชื่อมต่อที่สร้างไว้แล้วเข้ามา
// ----- 1. Import ทุก Model เข้ามา -----
const user_1 = __importDefault(require("../models/user"));
const patient_1 = __importDefault(require("../models/patient"));
const visits_1 = __importDefault(require("../models/visits"));
const symptom_1 = __importDefault(require("../models/symptom"));
const visitSymptoms_1 = __importDefault(require("../models/visitSymptoms"));
const procedure_1 = __importDefault(require("../models/procedure"));
const visitProcedures_1 = __importDefault(require("../models/visitProcedures"));
const services_1 = __importDefault(require("../models/services"));
const department_1 = __importDefault(require("../models/department"));
const doctor_1 = __importDefault(require("../models/doctor"));
const pharmacist_1 = __importDefault(require("../models/pharmacist"));
const diagnosis_1 = __importDefault(require("../models/diagnosis"));
const category_1 = __importDefault(require("../models/category"));
const product_1 = __importDefault(require("../models/product"));
// ----- 2. สร้าง db object เพื่อรวบรวมทุกอย่าง -----
const db = {};
db.sequelize = sequelize_2.default; // ใช้ sequelize ที่ import เข้ามา
db.Sequelize = sequelize_1.Sequelize;
db.User = user_1.default;
db.Patient = patient_1.default;
db.Visit = visits_1.default;
db.Symptom = symptom_1.default;
db.VisitSymptom = visitSymptoms_1.default;
db.Procedure = procedure_1.default;
db.VisitProcedure = visitProcedures_1.default;
db.Service = services_1.default;
db.Department = department_1.default;
db.Doctor = doctor_1.default;
db.Pharmacist = pharmacist_1.default;
db.Diagnosis = diagnosis_1.default;
db.Category = category_1.default;
db.Product = product_1.default;
// ----- 3. ใช้ Loop สร้างความสัมพันธ์อัตโนมัติ -----
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
// ----- 4. Export db object ที่มีทุกอย่างออกไป -----
exports.default = db;
