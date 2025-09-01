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
exports.insertPatient = exports.deletePatientById = exports.selectById = exports.getAllPatients = void 0;
const index_1 = __importDefault(require("./index"));
// ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยทั้งหมดจากฐานข้อมูล
const getAllPatients = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield index_1.default.query(
        // ลบ age ออกจาก SELECT
        "SELECT id, prefix, first_name, last_name, address, patient_id, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate, status FROM patient");
        return rows.map(row => ({
            id: row.id,
            prefix: row.prefix,
            firstName: row.first_name,
            lastName: row.last_name,
            // ลบ age ออกจากการ map ข้อมูล
            address: row.address,
            patientId: row.patient_id,
            birthDate: row.birthDate ? new Date(row.birthDate) : null,
            status: row.status,
        }));
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.getAllPatients = getAllPatients;
// ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยตาม ID
const selectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield index_1.default.query(
        // ลบ age ออกจาก SELECT
        "SELECT id, prefix, first_name, last_name, address, patient_id, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate, status FROM patient WHERE id = ?", [id]);
        return rows.length > 0 ? rows.map(row => ({
            id: row.id,
            prefix: row.prefix,
            firstName: row.first_name,
            lastName: row.last_name,
            // ลบ age ออกจากการ map ข้อมูล
            address: row.address,
            patientId: row.patient_id,
            birthDate: row.birthDate ? new Date(row.birthDate) : null,
            status: row.status,
        }))[0] : null;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.selectById = selectById;
// ฟังก์ชันสำหรับลบผู้ป่วยตาม ID (โค้ดนี้ถูกต้องอยู่แล้ว)
const deletePatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield index_1.default.query("DELETE FROM patient WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            console.warn(`No patient found with ID: ${id}`);
        }
    }
    catch (err) {
        console.error("Database deletion error (deletePatientById):", err);
        throw err;
    }
});
exports.deletePatientById = deletePatientById;
// ฟังก์ชันสำหรับเพิ่มผู้ป่วยใหม่
const insertPatient = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.default.query(
        // ลบ age ออกจาก INSERT
        `INSERT INTO patient (prefix, first_name, last_name, address, patient_id, birth_date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            patient.prefix,
            patient.firstName,
            patient.lastName,
            // ลบ patient.age
            patient.address,
            patient.patientId,
            patient.birthDate,
            patient.status
        ]);
    }
    catch (err) {
        console.error("Database insertion error (insertPatient):", err);
        throw err;
    }
});
exports.insertPatient = insertPatient;
// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ป่วยตาม ID
const updatePatient = (id, patient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.default.query(
        // ลบ age ออกจาก UPDATE
        `UPDATE patient
             SET prefix = ?,
                 first_name = ?,
                 last_name = ?,
                 address = ?,
                 patient_id = ?,
                 birth_date = ?,
                 status = ?
             WHERE id = ?`, [
            patient.prefix,
            patient.firstName,
            patient.lastName,
            // ลบ patient.age
            patient.address,
            patient.patientId,
            patient.birthDate,
            patient.status,
            id
        ]);
    }
    catch (err) {
        console.error("Database update error (updatePatient):", err);
        throw err;
    }
});
// ... โค้ดส่วน export default ...
exports.default = {
    selectAll: exports.getAllPatients,
    selectById: exports.selectById,
    deletePatientById: exports.deletePatientById,
    insertPatient: exports.insertPatient,
    updatePatient,
    // ฟังก์ชัน insertPatients ก็ต้องลบ age ออกเช่นกันถ้าจะใช้งาน
};
