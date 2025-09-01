// src/services/visitProcedure.service.ts

import { RowDataPacket, OkPacket, PoolConnection } from 'mysql2/promise';
import { pool } from '../config/db';
import { VisitProcedure, IProcedureInput, IProcedureOutput } from '../models/visitProcedures';

// --- Private Helper Function (ใช้ภายใน Class นี้เท่านั้น) ---
const getIdByName = async (
  tableName: 'Services' | 'Procedures' | 'Diagnosis',
  nameColumn: 'service_name' | 'procedure_name' | 'diagnosis_name',
  idColumn: 'service_id' | 'procedure_id' | 'diagnosis_id',
  name: string | null
): Promise<number | null> => {
  if (!name || name === '-' || name === 'อื่นๆ') {
    return null;
  }
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT ${idColumn} FROM ${tableName} WHERE ${nameColumn} = ?`, [name]);
    return rows.length > 0 ? rows[0][idColumn] : null;
  } catch (error) {
    console.error(`Error fetching ID from ${tableName} for name "${name}":`, error);
    return null;
  }
};


export class VisitProcedureService {

    static async createMultipleProcedures(visitId: number, procedures: IProcedureInput[]): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('DELETE FROM VisitProcedures WHERE visit_id = ?', [visitId]);

            for (const proc of procedures) {
                const service_id = await getIdByName('Services', 'service_name', 'service_id', proc.service);
                const procedure_id = await getIdByName('Procedures', 'procedure_name', 'procedure_id', proc.procedure);
                const diagnosis_id = await getIdByName('Diagnosis', 'diagnosis_name', 'diagnosis_id', proc.diagnosis);

                const procedureData: VisitProcedure = {
                    visit_id: visitId,
                    service_id: service_id,
                    procedure_id: procedure_id,
                    diagnosis_id: diagnosis_id,
                    notes: proc.notes || null
                };
                
                await connection.query<OkPacket>('INSERT INTO VisitProcedures SET ?', [procedureData]);
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error('Transaction failed for adding procedures:', error);
            throw new Error('Failed to save procedures.');
        } finally {
            connection.release();
        }
    }

    // =================================================================================
    // ===== START: FIXED CODE BLOCK / จุดที่แก้ไขโค้ด =====
    // =================================================================================
    static async getProceduresWithNamesByVisitId(visitId: number): Promise<IProcedureOutput[]> {
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
            const [rows] = await pool.query<RowDataPacket[]>(query, [visitId]);
            return rows as IProcedureOutput[];
        } catch (error) {
            console.error('Error fetching procedures with names:', error);
            throw new Error('Failed to retrieve procedures.');
        }
    }
    // =================================================================================
    // ===== END: FIXED CODE BLOCK / สิ้นสุดจุดที่แก้ไขโค้ด =====
    // =================================================================================
}
