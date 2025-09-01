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
exports.getVisitProcedures = exports.addOrUpdateVisitProcedures = void 0;
const visitProcedure_service_1 = require("../services/visitProcedure.service");
/**
 * Controller function to handle adding multiple procedures to a visit.
 * (ฟังก์ชันบันทึกข้อมูลเดิมของคุณ - ถูกต้องแล้ว)
 */
const addOrUpdateVisitProcedures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. ดึง visit_id จาก URL parameter
        const visitId = parseInt(req.params.visit_id, 10);
        // 2. ดึง "รายการการรักษา" (Array) จาก request body
        const procedures = req.body;
        // ตรวจสอบว่าข้อมูลที่ได้มาถูกต้องหรือไม่
        if (isNaN(visitId) || !Array.isArray(procedures)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        // 3. เรียกใช้ Service เพื่อบันทึกข้อมูล
        yield visitProcedure_service_1.VisitProcedureService.createMultipleProcedures(visitId, procedures);
        // 4. ส่งคำตอบกลับไปว่าทำสำเร็จแล้ว
        res.status(201).json({ message: 'Procedures saved successfully' });
    }
    catch (error) {
        console.error('Error in addOrUpdateVisitProcedures controller:', error);
        res.status(500).json({ message: 'Server error while saving procedures' });
    }
});
exports.addOrUpdateVisitProcedures = addOrUpdateVisitProcedures;
// =================================================================================
// ===== START: ADDED CODE BLOCK / เพิ่มฟังก์ชันใหม่ตรงนี้ =====
// =================================================================================
/**
 * Controller function to get all procedures for a specific visit.
 * (ฟังก์ชันสำหรับดึงข้อมูลการรักษา - เพิ่มใหม่)
 */
const getVisitProcedures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) {
            return res.status(400).json({ message: 'Invalid visit ID' });
        }
        // --- เรียกใช้ฟังก์ชันใหม่จาก Service ที่เราสร้างไว้ ---
        const procedures = yield visitProcedure_service_1.VisitProcedureService.getProceduresWithNamesByVisitId(visitId);
        // ส่งข้อมูลที่ได้ (พร้อมชื่อ) กลับไปให้ Frontend
        res.status(200).json(procedures);
    }
    catch (error) {
        console.error('Error in getVisitProcedures controller:', error);
        res.status(500).json({ message: 'Server error while fetching procedures' });
    }
});
exports.getVisitProcedures = getVisitProcedures;
// =================================================================================
// ===== END: ADDED CODE BLOCK / สิ้นสุดส่วนที่เพิ่ม =====
// =================================================================================
