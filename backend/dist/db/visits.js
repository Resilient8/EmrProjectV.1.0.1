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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVisit = exports.insertVisit = exports.deleteVisitById = exports.selectVisitsByPatientId = exports.selectVisitById = exports.getAllVisits = void 0;
const db_1 = require("../config/db"); // <<-- เปลี่ยน promisePool เป็น pool เพื่อให้ตรงกับ export ใน db.ts
// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมทั้งหมด
const getAllVisits = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "SELECT * FROM Visits" // ใช้ชื่อตาราง Visits ตามที่คุณตั้งไว้
        );
        return rows.map(row => ({
            visit_id: row.visit_id,
            patient_id: row.patient_id,
            visit_datetime: row.visit_datetime,
            temperature: row.temperature,
            pulse: row.pulse,
            respiration: row.respiration,
            blood_pressure: row.blood_pressure,
            height: row.height,
            weight: row.weight,
            bmi: row.bmi,
            waist_circumference: row.waist_circumference,
            allergies: row.allergies,
            underlying_diseases: row.underlying_diseases,
            symptoms: row.symptoms,
            notes: row.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณมีในตาราง visits
        }));
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
        const [rows] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "SELECT * FROM Visits WHERE visit_id = ?", [id]);
        return rows.length > 0 ? rows.map(row => ({
            visit_id: row.visit_id,
            patient_id: row.patient_id,
            visit_datetime: row.visit_datetime,
            temperature: row.temperature,
            pulse: row.pulse,
            respiration: row.respiration,
            blood_pressure: row.blood_pressure,
            height: row.height,
            weight: row.weight,
            bmi: row.bmi,
            waist_circumference: row.waist_circumference,
            allergies: row.allergies,
            underlying_diseases: row.underlying_diseases,
            symptoms: row.symptoms,
            notes: row.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณมีในตาราง visits
        }))[0] : null;
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
        const [rows] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "SELECT * FROM Visits WHERE patient_id = ?", [patientId]);
        return rows.map(row => ({
            visit_id: row.visit_id,
            patient_id: row.patient_id,
            visit_datetime: row.visit_datetime,
            temperature: row.temperature,
            pulse: row.pulse,
            respiration: row.respiration,
            blood_pressure: row.blood_pressure,
            height: row.height,
            weight: row.weight,
            bmi: row.bmi,
            waist_circumference: row.waist_circumference,
            allergies: row.allergies,
            underlying_diseases: row.underlying_diseases,
            symptoms: row.symptoms,
            notes: row.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณมีในตาราง visits
        }));
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
        const [result] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "DELETE FROM Visits WHERE visit_id = ?", [id]);
        if (result.affectedRows === 0) {
            console.warn(`ไม่พบข้อมูลการเยี่ยมที่มี ID: ${id}`);
        }
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
        const [result] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        `INSERT INTO Visits (patient_id, visit_datetime, temperature, pulse, respiration, blood_pressure, height, weight, bmi, waist_circumference, allergies, underlying_diseases, symptoms, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            visit.patient_id,
            visit.visit_datetime,
            visit.temperature,
            visit.pulse,
            visit.respiration,
            visit.blood_pressure,
            visit.height,
            visit.weight,
            visit.bmi,
            visit.waist_circumference,
            visit.allergies,
            visit.underlying_diseases,
            visit.symptoms,
            visit.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณต้องการ Insert
        ]);
        if (result.affectedRows === 0) {
            console.warn("การเพิ่มข้อมูลการเยี่ยมไม่สำเร็จ");
        }
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
        const [result] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        `UPDATE Visits
            SET patient_id = ?,
                visit_datetime = ?,
                temperature = ?,
                pulse = ?,
                respiration = ?,
                blood_pressure = ?,
                height = ?,
                weight = ?,
                bmi = ?,
                waist_circumference = ?,
                allergies = ?,
                underlying_diseases = ?,
                symptoms = ?,
                notes = ?
            WHERE visit_id = ?`, [
            visit.patient_id,
            visit.visit_datetime,
            visit.temperature,
            visit.pulse,
            visit.respiration,
            visit.blood_pressure,
            visit.height,
            visit.weight,
            visit.bmi,
            visit.waist_circumference,
            visit.allergies,
            visit.underlying_diseases,
            visit.symptoms,
            visit.notes,
            id,
            // เพิ่ม Fields อื่นๆ ที่คุณต้องการ Update
        ]);
        if (result.affectedRows === 0) {
            console.warn(`ไม่พบข้อมูลการเยี่ยมที่มี ID: ${id} สำหรับการอัปเดต`);
        }
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการเยี่ยม:", err);
        throw err;
    }
});
exports.updateVisit = updateVisit;
exports.default = {
    selectAll: exports.getAllVisits,
    selectVisitById: exports.selectVisitById,
    selectVisitsByPatientId: exports.selectVisitsByPatientId,
    deleteVisitById: exports.deleteVisitById,
    insertVisit: exports.insertVisit,
    updateVisit: exports.updateVisit,
};
