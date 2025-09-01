"use strict";
// src/services/visitProcedure.service.ts
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
exports.VisitProcedureService = void 0;
const db_1 = require("../config/db");
// --- Private Helper Function (ใช้ภายใน Class นี้เท่านั้น) ---
const getIdByName = (tableName, nameColumn, idColumn, name) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || name === '-' || name === 'อื่นๆ') {
        return null;
    }
    try {
        const [rows] = yield db_1.pool.query(`SELECT ${idColumn} FROM ${tableName} WHERE ${nameColumn} = ?`, [name]);
        return rows.length > 0 ? rows[0][idColumn] : null;
    }
    catch (error) {
        console.error(`Error fetching ID from ${tableName} for name "${name}":`, error);
        return null;
    }
});
class VisitProcedureService {
    static createMultipleProcedures(visitId, procedures) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                yield connection.query('DELETE FROM VisitProcedures WHERE visit_id = ?', [visitId]);
                for (const proc of procedures) {
                    const service_id = yield getIdByName('Services', 'service_name', 'service_id', proc.service);
                    const procedure_id = yield getIdByName('Procedures', 'procedure_name', 'procedure_id', proc.procedure);
                    const diagnosis_id = yield getIdByName('Diagnosis', 'diagnosis_name', 'diagnosis_id', proc.diagnosis);
                    const procedureData = {
                        visit_id: visitId,
                        service_id: service_id,
                        procedure_id: procedure_id,
                        diagnosis_id: diagnosis_id,
                        notes: proc.notes || null
                    };
                    yield connection.query('INSERT INTO VisitProcedures SET ?', [procedureData]);
                }
                yield connection.commit();
            }
            catch (error) {
                yield connection.rollback();
                console.error('Transaction failed for adding procedures:', error);
                throw new Error('Failed to save procedures.');
            }
            finally {
                connection.release();
            }
        });
    }
    // =================================================================================
    // ===== START: FIXED CODE BLOCK / จุดที่แก้ไขโค้ด =====
    // =================================================================================
    static getProceduresWithNamesByVisitId(visitId) {
        return __awaiter(this, void 0, void 0, function* () {
            // SQL query ที่ใช้ LEFT JOIN เพื่อดึงข้อมูลชื่อจากตาราง master ทั้ง 3 ตาราง
            const query = `
            SELECT
                vp.id, -- <<< FIX: เปลี่ยนจาก vp.visit_procedure_id เป็น vp.id
                vp.visit_id,
                vp.notes,
                s.service_name,
                p.procedure_name,
                d.diagnosis_name
            FROM
                VisitProcedures vp
            LEFT JOIN
                Services s ON vp.service_id = s.service_id
            LEFT JOIN
                Procedures p ON vp.procedure_id = p.procedure_id
            LEFT JOIN
                Diagnosis d ON vp.diagnosis_id = d.diagnosis_id
            WHERE
                vp.visit_id = ?;
        `;
            try {
                const [rows] = yield db_1.pool.query(query, [visitId]);
                return rows;
            }
            catch (error) {
                console.error('Error fetching procedures with names:', error);
                throw new Error('Failed to retrieve procedures.');
            }
        });
    }
}
exports.VisitProcedureService = VisitProcedureService;
