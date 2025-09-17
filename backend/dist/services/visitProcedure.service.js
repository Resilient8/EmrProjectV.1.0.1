"use strict";
// src/services/visitProcedure.service.ts (เวอร์ชันอัปเกรด)
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
exports.VisitProcedureService = void 0;
const db_1 = __importDefault(require("../db")); // Import db object ที่มีทุกอย่างจาก index.ts
const { VisitProcedure, Service, Procedure, Diagnosis, sequelize } = db_1.default;
class VisitProcedureService {
    static createMultipleProcedures(visitId, procedures) {
        return __awaiter(this, void 0, void 0, function* () {
            // ใช้ Transaction ของ Sequelize เพื่อความปลอดภัย
            const t = yield sequelize.transaction();
            try {
                // 1. ลบรายการเก่าของ visitId นี้ทิ้งทั้งหมดก่อน
                yield VisitProcedure.destroy({
                    where: { visit_id: visitId },
                    transaction: t
                });
                // 2. เตรียมข้อมูลใหม่ทั้งหมดที่จะ Insert
                const proceduresToCreate = yield Promise.all(procedures.map((proc) => __awaiter(this, void 0, void 0, function* () {
                    // ใช้ Sequelize หา ID จากชื่อให้เราอัตโนมัติ (ถ้าไม่มีก็หาไม่เจอ -> null)
                    const service = yield Service.findOne({ where: { service_name: proc.service }, transaction: t });
                    const procedure = proc.procedure ? yield Procedure.findOne({ where: { procedure_name: proc.procedure }, transaction: t }) : null;
                    const diagnosis = proc.diagnosis ? yield Diagnosis.findOne({ where: { diagnosis_name: proc.diagnosis }, transaction: t }) : null;
                    return {
                        visit_id: visitId,
                        service_id: (service === null || service === void 0 ? void 0 : service.service_id) || null,
                        procedure_id: (procedure === null || procedure === void 0 ? void 0 : procedure.procedure_id) || null,
                        diagnosis_id: (diagnosis === null || diagnosis === void 0 ? void 0 : diagnosis.diagnosis_id) || null,
                        notes: proc.notes || null,
                    };
                })));
                // 3. สั่ง Bulk Create เพื่อเพิ่มข้อมูลทั้งหมดในครั้งเดียว (มีประสิทธิภาพกว่า)
                if (proceduresToCreate.length > 0) {
                    yield VisitProcedure.bulkCreate(proceduresToCreate, { transaction: t });
                }
                // 4. ถ้าทุกอย่างสำเร็จ ให้ commit transaction
                yield t.commit();
            }
            catch (error) {
                // 5. ถ้ามีอะไรผิดพลาด ให้ rollback transaction
                yield t.rollback();
                console.error('Transaction failed for adding procedures:', error);
                throw new Error('Failed to save procedures.');
            }
        });
    }
    static getProceduresWithNamesByVisitId(visitId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ใช้ .findAll พร้อมกับ `include` เพื่อ JOIN ตารางโดยอัตโนมัติ
                const results = yield VisitProcedure.findAll({
                    where: { visit_id: visitId },
                    include: [
                        {
                            model: Service,
                            attributes: ['service_name'], // ดึงมาแค่ชื่อ
                            required: false // ใช้ LEFT JOIN
                        },
                        {
                            model: Procedure,
                            attributes: ['procedure_name'],
                            required: false
                        },
                        {
                            model: Diagnosis,
                            attributes: ['diagnosis_name'],
                            required: false
                        }
                    ],
                    attributes: ['id', 'visit_id', 'notes'], // เลือกคอลัมน์จากตารางหลัก
                    raw: true, // ทำให้ผลลัพธ์เป็น JSON ธรรมดา
                    nest: true // จัดกลุ่มผลลัพธ์ที่ JOIN มา
                });
                // จัดรูปแบบข้อมูลใหม่ให้ตรงกับ IProcedureOutput
                return results.map((r) => {
                    var _a, _b, _c;
                    return ({
                        id: r.id,
                        visit_id: r.visit_id,
                        notes: r.notes,
                        service_name: ((_a = r.Service) === null || _a === void 0 ? void 0 : _a.service_name) || null,
                        procedure_name: ((_b = r.Procedure) === null || _b === void 0 ? void 0 : _b.procedure_name) || null,
                        diagnosis_name: ((_c = r.Diagnosis) === null || _c === void 0 ? void 0 : _c.diagnosis_name) || null,
                    });
                });
            }
            catch (error) {
                console.error('Error fetching procedures with names:', error);
                throw new Error('Failed to retrieve procedures.');
            }
        });
    }
}
exports.VisitProcedureService = VisitProcedureService;
