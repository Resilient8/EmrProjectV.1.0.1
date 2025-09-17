"use strict";
// src/controller/patientController.ts (เวอร์ชันแก้ไข)
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
exports.getPatientRegistry = exports.updatePatientStatus = exports.updatePatient = exports.createPatient = exports.deletePatientById = exports.getPatientById = exports.getAllPatients = void 0;
const db_1 = __importDefault(require("../db"));
const { Patient, Visit } = db_1.default; // ไม่จำเป็นต้อง import sequelize ถ้าไม่ได้ใช้โดยตรง
// --- ดึงข้อมูลผู้ป่วยทั้งหมด ---
const getAllPatients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield Patient.findAll();
        res.status(200).json({
            message: "OK",
            result: patients,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllPatients = getAllPatients;
// --- ดึงข้อมูลผู้ป่วยตาม ID ---
const getPatientById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
    }
    try {
        const patient = yield Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: "ไม่พบผู้ป่วย" });
        }
        res.status(200).json(patient);
    }
    catch (err) {
        next(err);
    }
});
exports.getPatientById = getPatientById;
// --- ลบผู้ป่วยตาม ID ---
const deletePatientById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
    }
    try {
        const affectedRows = yield Patient.destroy({ where: { id: id } });
        if (affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ป่วยที่จะลบ" });
        }
        res.status(200).json({
            message: "OK",
            result: `ผู้ป่วยที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deletePatientById = deletePatientById;
// --- สร้างผู้ป่วยใหม่ ---
const createPatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPatientData = req.body;
    if (!newPatientData.first_name || !newPatientData.last_name) {
        return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
    try {
        const createdPatient = yield Patient.create(newPatientData);
        res.status(201).json({ message: "สร้างผู้ป่วยเรียบร้อยแล้ว", result: createdPatient });
    }
    catch (err) {
        next(err);
    }
});
exports.createPatient = createPatient;
// --- อัปเดตข้อมูลผู้ป่วย ---
const updatePatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    const updatedPatientData = req.body;
    if (isNaN(id)) {
        return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
    try {
        const [affectedRows] = yield Patient.update(updatedPatientData, { where: { id: id } });
        if (affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ป่วยที่จะอัปเดต" });
        }
        res.status(200).json({ message: `ผู้ป่วยที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว` });
    }
    catch (err) {
        next(err);
    }
});
exports.updatePatient = updatePatient;
// --- อัปเดตสถานะผู้ป่วย ---
const updatePatientStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientId = parseInt(req.params.id, 10);
        const { status } = req.body;
        if (isNaN(patientId) || !status) {
            return res.status(400).json({ message: 'Invalid patient ID or status provided.' });
        }
        const [affectedRows] = yield Patient.update({ status: status }, { where: { id: patientId } });
        if (affectedRows === 0) {
            return res.status(404).json({ message: `Patient with ID ${patientId} not found.` });
        }
        res.status(200).json({ message: `Patient ${patientId} status updated to ${status}` });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePatientStatus = updatePatientStatus;
// --- ดึงข้อมูลสำหรับหน้าทะเบียนผู้ป่วย (เพิ่มการ Log Error) ---
const getPatientRegistry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("--- Running SIMPLIFIED getPatientRegistry query ---");
        const patientsWithVisits = yield Patient.findAll({
            include: [{
                    model: Visit,
                    as: 'visits',
                    required: true // ยังคงดึงเฉพาะผู้ป่วยที่มี visit เท่านั้น
                }],
            order: [
                // เรียงลำดับตาม visit ล่าสุด (แต่จะแสดงทุก visit)
                [{ model: Visit, as: 'visits' }, 'visit_datetime', 'DESC']
            ]
        });
        res.status(200).json(patientsWithVisits);
    }
    catch (error) {
        // --- จุดที่แก้ไข ---
        console.error("🔥🔥 Error executing getPatientRegistry:", error);
        next(error);
    }
});
exports.getPatientRegistry = getPatientRegistry;
