// src/services/diagnosis.service.ts

import { RowDataPacket, OkPacket } from 'mysql2'; // เพิ่ม OkPacket หากคุณใช้ในอนาคต
import { pool } from '../config/db'; // ตรวจสอบ path ของ pool ให้ถูกต้อง

export interface Diagnosis { // นี่คือ Interface สำหรับข้อมูล Diagnosis
    diagnosis_id: number;
    diagnosis_name: string;
    // เพิ่ม field อื่นๆ ที่คุณมีในตาราง Diagnosis
}

// *** แก้ไขตรงนี้: ต้องมี 'export' นำหน้า class ***
export class DiagnosisService {
    static async getAllDiagnosis(): Promise<Diagnosis[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Diagnosis'); // ตรวจสอบชื่อตารางใน DB ของคุณว่า 'Diagnosis' หรือ 'Diagnoses'
        return rows as Diagnosis[];
    }

    static async getDiagnosisById(diagnosis_id: number): Promise<Diagnosis | undefined> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Diagnosis WHERE diagnosis_id = ?', [diagnosis_id]);
        return rows.length > 0 ? rows[0] as Diagnosis : undefined;
    }

    // ถ้ามีเมธอดอื่นๆ ที่เกี่ยวข้องกับ Diagnosis ให้ใส่ไว้ใน Class นี้
    // ตัวอย่าง:
    // static async createDiagnosis(diagnosisData: Diagnosis): Promise<number> { ... }
}