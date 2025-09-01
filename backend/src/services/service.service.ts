// src/services/service.service.ts
import { RowDataPacket, OkPacket } from 'mysql2';
import { pool } from '../config/db'; // ตรวจสอบ path ให้ถูกต้อง

export interface Service { // interface สำหรับ Service
    service_id: number;
    service_name: string;
    category_id?: number | null; // หรือตามที่คุณออกแบบ
}

export class ServiceService { // นี่คือ class ที่ visits.controller.ts คาดหวัง
    static async getAllServices(): Promise<Service[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Services');
        return rows as Service[];
    }
}