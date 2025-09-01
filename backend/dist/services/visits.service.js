"use strict";
// src/services/visits.service.ts
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
exports.VisitService = void 0;
const db_1 = require("../config/db");
// Interface ไม่จำเป็นต้องใช้แล้ว เพราะเราแยก Logic ไปหมดแล้ว
// export interface CreateVisitRequest extends Visit { ... }
// export interface UpdateVisitRequest extends Visit { ... }
class VisitService {
    // ดึงข้อมูลการเยี่ยมทั้งหมด
    static getAllVisits() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Visits');
            return rows;
        });
    }
    // ดึงข้อมูลการเยี่ยมตาม ID
    static getVisitById(visit_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Visits WHERE visit_id = ?', [visit_id]);
            if (rows.length === 0) {
                return undefined;
            }
            return rows[0];
        });
    }
    // ดึงข้อมูลการเยี่ยมของผู้ป่วยตาม Patient ID
    static getVisitsByPatientId(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Visits WHERE patient_id = ?', [patientId]);
            return rows;
        });
    }
    // =================================================================================
    // ===== START: SIMPLIFIED CODE BLOCK / แก้ไขโค้ดให้ง่ายลง =====
    // =================================================================================
    // ฟังก์ชันเหล่านี้จะจัดการแค่ตาราง Visits เท่านั้น ไม่ยุ่งกับ Procedures แล้ว
    /**
     * สร้างข้อมูล Visit ใหม่ (จัดการแค่ตาราง Visits)
     */
    static createVisit(visitData) {
        return __awaiter(this, void 0, void 0, function* () {
            // ไม่ต้องจัดการกับ visitProcedures ที่นี่แล้ว
            const [result] = yield db_1.pool.query('INSERT INTO Visits SET ?', [visitData]);
            return result.insertId;
        });
    }
    /**
     * อัปเดตข้อมูล Visit (จัดการแค่ตาราง Visits)
     */
    static updateVisit(visit_id, visitData) {
        return __awaiter(this, void 0, void 0, function* () {
            // ไม่ต้องจัดการกับ visitProcedures ที่นี่แล้ว
            const [result] = yield db_1.pool.query('UPDATE Visits SET ? WHERE visit_id = ?', [visitData, visit_id]);
            return result.affectedRows > 0;
        });
    }
    /**
     * ลบข้อมูล Visit (จัดการแค่ตาราง Visits)
     * **หมายเหตุ:** คุณอาจจะต้องตั้งค่า Database ให้ลบข้อมูลที่เกี่ยวข้อง (เช่น symptoms, procedures) อัตโนมัติ
     * เมื่อ Visit ถูกลบ (ON DELETE CASCADE) หรือจัดการลบใน Controller แทน
     */
    static deleteVisit(visit_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // โดยปกติแล้ว เราจะลบข้อมูลที่เกี่ยวข้องก่อน
            // แต่เนื่องจากเราแยก Logic ไปแล้ว การจัดการลบควรทำในระดับ Controller หรือตั้งค่า DB
            const [result] = yield db_1.pool.query('DELETE FROM Visits WHERE visit_id = ?', [visit_id]);
            return result.affectedRows > 0;
        });
    }
}
exports.VisitService = VisitService;
