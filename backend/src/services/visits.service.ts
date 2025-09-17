// src/services/visits.service.ts

import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import  Visit  from '../models/visits';
// Import Service ของ Procedure เข้ามา
import { VisitProcedureService } from './visitProcedure.service';

// Interface ไม่จำเป็นต้องใช้แล้ว เพราะเราแยก Logic ไปหมดแล้ว
// export interface CreateVisitRequest extends Visit { ... }
// export interface UpdateVisitRequest extends Visit { ... }

export class VisitService {

    // ดึงข้อมูลการเยี่ยมทั้งหมด
    static async getAllVisits(): Promise<Visit[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Visits');
        return rows as Visit[];
    }

    // ดึงข้อมูลการเยี่ยมตาม ID
    static async getVisitById(visit_id: number): Promise<Visit | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Visits WHERE visit_id = ?', [visit_id]);
        if (rows.length === 0) {
            return undefined;
        }
        return rows[0] as Visit;
    }

    // ดึงข้อมูลการเยี่ยมของผู้ป่วยตาม Patient ID
    static async getVisitsByPatientId(patientId: string): Promise<Visit[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Visits WHERE patient_id = ?', [patientId]);
        return rows as Visit[];
    }

    // =================================================================================
    // ===== START: SIMPLIFIED CODE BLOCK / แก้ไขโค้ดให้ง่ายลง =====
    // =================================================================================
    // ฟังก์ชันเหล่านี้จะจัดการแค่ตาราง Visits เท่านั้น ไม่ยุ่งกับ Procedures แล้ว

    /**
     * สร้างข้อมูล Visit ใหม่ (จัดการแค่ตาราง Visits)
     */
    static async createVisit(visitData: Visit): Promise<number> {
        // ไม่ต้องจัดการกับ visitProcedures ที่นี่แล้ว
        const [result] = await pool.query<OkPacket>('INSERT INTO Visits SET ?', [visitData]);
        return result.insertId;
    }

    /**
     * อัปเดตข้อมูล Visit (จัดการแค่ตาราง Visits)
     */
    static async updateVisit(visit_id: number, visitData: Partial<Visit>): Promise<boolean> {
        // ไม่ต้องจัดการกับ visitProcedures ที่นี่แล้ว
        const [result] = await pool.query<OkPacket>('UPDATE Visits SET ? WHERE visit_id = ?', [visitData, visit_id]);
        return result.affectedRows > 0;
    }

    /**
     * ลบข้อมูล Visit (จัดการแค่ตาราง Visits)
     * **หมายเหตุ:** คุณอาจจะต้องตั้งค่า Database ให้ลบข้อมูลที่เกี่ยวข้อง (เช่น symptoms, procedures) อัตโนมัติ
     * เมื่อ Visit ถูกลบ (ON DELETE CASCADE) หรือจัดการลบใน Controller แทน
     */
    static async deleteVisit(visit_id: number): Promise<boolean> {
        // โดยปกติแล้ว เราจะลบข้อมูลที่เกี่ยวข้องก่อน
        // แต่เนื่องจากเราแยก Logic ไปแล้ว การจัดการลบควรทำในระดับ Controller หรือตั้งค่า DB
        const [result] = await pool.query<OkPacket>('DELETE FROM Visits WHERE visit_id = ?', [visit_id]);
        return result.affectedRows > 0;
    }
    // =================================================================================
    // ===== END: SIMPLIFIED CODE BLOCK / สิ้นสุดส่วนที่แก้ไข =====
    // =================================================================================
}
