// src/services/procedure.service.ts
import { RowDataPacket, OkPacket } from 'mysql2';
import { pool } from '../config/db'; // ตรวจสอบ path ให้ถูกต้อง

export interface Procedure { // interface สำหรับ Procedure
    procedure_id: number;
    procedure_name: string;
    category_id?: number | null; // หรือตามที่คุณออกแบบ
}

export class ProcedureService { // นี่คือ class ที่ visits.controller.ts คาดหวัง
    static async getAllProcedures(): Promise<Procedure[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Procedures');
        return rows as Procedure[];
    }
}