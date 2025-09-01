"use strict";
// src/services/diagnosis.service.ts
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
exports.DiagnosisService = void 0;
const db_1 = require("../config/db"); // ตรวจสอบ path ของ pool ให้ถูกต้อง
// *** แก้ไขตรงนี้: ต้องมี 'export' นำหน้า class ***
class DiagnosisService {
    static getAllDiagnosis() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Diagnosis'); // ตรวจสอบชื่อตารางใน DB ของคุณว่า 'Diagnosis' หรือ 'Diagnoses'
            return rows;
        });
    }
    static getDiagnosisById(diagnosis_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM Diagnosis WHERE diagnosis_id = ?', [diagnosis_id]);
            return rows.length > 0 ? rows[0] : undefined;
        });
    }
}
exports.DiagnosisService = DiagnosisService;
