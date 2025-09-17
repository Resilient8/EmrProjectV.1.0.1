"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVisit = exports.insertVisit = exports.deleteVisitById = exports.selectVisitsByPatientId = exports.selectVisitById = exports.getAllVisits = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./connection"));
// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมทั้งหมด
const getAllVisits = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visits = yield connection_1.default.query(// <-- เปลี่ยนเป็น sequelize
        "SELECT * FROM Visits", { type: sequelize_1.QueryTypes.SELECT });
        return visits;
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมทั้งหมด:", err);
        throw err;
    }
});
exports.getAllVisits = getAllVisits;
// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมตาม ID
const selectVisitById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visits = yield connection_1.default.query(// <-- เปลี่ยนเป็น sequelize
        "SELECT * FROM Visits WHERE visit_id = :id", {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.SELECT
        });
        return visits.length > 0 ? visits[0] : null;
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมที่มี ID ${id}:`, err);
        throw err;
    }
});
exports.selectVisitById = selectVisitById;
// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมของผู้ป่วยตาม patient_id
const selectVisitsByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visits = yield connection_1.default.query(// <-- เปลี่ยนเป็น sequelize
        "SELECT * FROM Visits WHERE patient_id = :patientId", {
            replacements: { patientId: patientId },
            type: sequelize_1.QueryTypes.SELECT
        });
        return visits;
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมของผู้ป่วยที่มี ID ${patientId}:`, err);
        throw err;
    }
});
exports.selectVisitsByPatientId = selectVisitsByPatientId;
// ฟังก์ชันสำหรับลบข้อมูลการเยี่ยมตาม ID
const deleteVisitById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.query(// <-- เปลี่ยนเป็น sequelize
        "DELETE FROM Visits WHERE visit_id = :id", {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.DELETE
        });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูลการเยี่ยม:", err);
        throw err;
    }
});
exports.deleteVisitById = deleteVisitById;
// ฟังก์ชันสำหรับเพิ่มข้อมูลการเยี่ยมใหม่
const insertVisit = (visit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.query(// <-- เปลี่ยนเป็น sequelize
        `INSERT INTO Visits (patient_id, visit_datetime, temperature, pulse, respiration, blood_pressure, height, weight, bmi, waist_circumference, allergies, underlying_diseases, symptoms, notes)
             VALUES (:patient_id, :visit_datetime, :temperature, :pulse, :respiration, :blood_pressure, :height, :weight, :bmi, :waist_circumference, :allergies, :underlying_diseases, :symptoms, :notes)`, {
            replacements: Object.assign({}, visit),
            type: sequelize_1.QueryTypes.INSERT
        });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลการเยี่ยม:", err);
        throw err;
    }
});
exports.insertVisit = insertVisit;
// ฟังก์ชันสำหรับอัปเดตข้อมูลการเยี่ยมตาม ID
const updateVisit = (id, visit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.query(// <-- เปลี่ยนเป็น sequelize
        `UPDATE Visits SET 
                patient_id = :patient_id, visit_datetime = :visit_datetime, temperature = :temperature, 
                pulse = :pulse, respiration = :respiration, blood_pressure = :blood_pressure, 
                height = :height, weight = :weight, bmi = :bmi, waist_circumference = :waist_circumference, 
                allergies = :allergies, underlying_diseases = :underlying_diseases, 
                symptoms = :symptoms, notes = :notes
             WHERE visit_id = :id`, {
            replacements: Object.assign(Object.assign({}, visit), { id: id }),
            type: sequelize_1.QueryTypes.UPDATE
        });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการเยี่ยม:", err);
        throw err;
    }
});
exports.updateVisit = updateVisit;
exports.default = {
    selectAll: exports.getAllVisits,
    selectById: exports.selectVisitById,
    selectByPatientId: exports.selectVisitsByPatientId,
    deleteById: exports.deleteVisitById,
    insert: exports.insertVisit,
    update: exports.updateVisit,
};
