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
exports.getPatientRegistry = exports.updatePatientStatus = void 0;
const db_1 = __importDefault(require("../db"));
const patient_1 = __importDefault(require("../db/patient"));
// ... (ฟังก์ชันอื่นๆ ของคุณ getAllPatients, createPatient, etc. ไม่ต้องแก้ไข) ...
const getAllPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patient_1.default.selectAll();
        res.status(200).json({
            message: "OK",
            result: patients,
        });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย:", err);
        res.status(500).json({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
const getPatientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
    }
    try {
        const patient = yield patient_1.default.selectById(id);
        if (!patient) {
            return res.status(404).json({ message: "ไม่พบผู้ป่วย" });
        }
        res.status(200).json(patient);
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วยที่มี ID ${id}:`, err);
        res.status(500).json({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
const deletePatientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
    }
    try {
        yield patient_1.default.deletePatientById(id);
        res.status(200).json({
            message: "OK",
            result: `ผู้ป่วยที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
        });
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการลบผู้ป่วยที่มี ID ${id}:`, err);
        res.status(500).json({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPatient = req.body;
    if (!newPatient.firstName || !newPatient.lastName) {
        return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
    try {
        yield patient_1.default.insertPatient(newPatient);
        res.status(201).json({ message: "สร้างผู้ป่วยเรียบร้อยแล้ว" });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย:", err);
        res.status(500).json({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    const updatedPatient = req.body;
    if (isNaN(id) || !updatedPatient.firstName || !updatedPatient.lastName) {
        return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
    try {
        yield patient_1.default.updatePatient(id, updatedPatient);
        res.status(200).json({ message: `ผู้ป่วยที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว` });
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการอัปเดตผู้ป่วยที่มี ID ${id}:`, err);
        res.status(500).json({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
const updatePatientStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientId = parseInt(req.params.id, 10);
        const { status } = req.body;
        if (isNaN(patientId) || !status) {
            return res.status(400).json({ message: 'Invalid patient ID or status provided.' });
        }
        const [result] = yield db_1.default.query('UPDATE patient SET status = ? WHERE id = ?', [status, patientId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Patient with ID ${patientId} not found.` });
        }
        res.status(200).json({ message: `Patient ${patientId} status updated to ${status}` });
    }
    catch (error) {
        console.error('Error updating patient status:', error);
        res.status(500).json({ message: 'Server error while updating status.' });
    }
});
exports.updatePatientStatus = updatePatientStatus;
/**
 * ดึงข้อมูลสำหรับหน้าทะเบียนผู้ป่วยโดยเฉพาะ
 */
const getPatientRegistry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // --- FIX: เปลี่ยนชื่อตารางจาก visit เป็น Visits ---
        const query = `
      SELECT
          p.id,
          p.prefix,
          p.first_name,
          p.last_name,
          p.patient_id,
          p.status,
          p.birth_date,
          v.visit_datetime AS arrivalTime,
          v.visit_id
      FROM
          patient p
      JOIN
          Visits v ON p.patient_id = v.patient_id
      WHERE
          v.visit_datetime = (
              SELECT MAX(v2.visit_datetime)
              FROM Visits v2
              WHERE v2.patient_id = p.patient_id
          )
      ORDER BY
          v.visit_datetime DESC;
    `;
        const [rows] = yield db_1.default.query(query);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error fetching patient registry:', error);
        // ส่งต่อ error ไปให้ middleware จัดการ
        next(error);
    }
});
exports.getPatientRegistry = getPatientRegistry;
exports.default = {
    getAllPatients,
    getPatientById,
    deletePatientById,
    createPatient,
    updatePatient,
    updatePatientStatus: exports.updatePatientStatus,
    getPatientRegistry: exports.getPatientRegistry
};
