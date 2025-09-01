// src/models/visits.ts
import { VisitProcedure } from './visitProcedures'; // ตรวจสอบ path ให้ถูกต้อง

export interface Visit {
    visit_id?: number; // Optional ถ้าเป็น auto-increment ใน DB
    patient_id: string; // ตรวจสอบ type ให้ตรงกับ DB
    visit_datetime: Date;
    temperature?: number | null;
    pulse?: number | null;
    respiration?: number | null;
    blood_pressure?: string | null;
    height?: number | null;
    weight?: number | null;
    bmi?: number | null;
    waist_circumference?: number | null;
    allergies?: string | null;
    underlying_diseases?: string | null;
    symptoms?: string | null;
    notes?: string | null;
    Userid?: number | null; // ตรวจสอบว่ามีคอลัมน์นี้ใน DB จริงหรือไม่ และเป็น type อะไร
    diagnosis_id?: number | null; // ตรวจสอบว่ามีคอลัมน์นี้ใน DB จริงหรือไม่ และเป็น type อะไร
    
    // *** เพิ่มบรรทัดนี้: เพื่อเก็บข้อมูล VisitProcedures ที่เกี่ยวข้อง ***
    visitProcedures?: VisitProcedure[];
}