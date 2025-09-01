// src/models/visitProcedures.ts

export interface VisitProcedure {
    id?: number; // Primary Key, Optional เพราะจะถูกสร้างโดย DB ตอน Insert
    visit_id: number; // Foreign Key ไปยัง Visits.visit_id
    service_id: number | null; // Foreign Key ไปยัง Services.service_id, allow null
    procedure_id: number | null; // Foreign Key ไปยัง Procedures.procedure_id, allow null
    diagnosis_id: number | null; // Foreign Key ไปยัง Diagnosis.diagnosis_id, allow null
    notes?: string | null; // บันทึกเพิ่มเติมสำหรับรายการหัตถการนี้ (จากช่อง "บันทึกเพิ่มเติม" ใน Frontend)

    // **เพิ่ม field เหล่านี้สำหรับตอนดึงข้อมูล**
    // เพื่อให้ Frontend แสดง "ชื่อ" ได้ ไม่ใช่แค่ "ID"
    service_name?: string;
    procedure_name?: string;
    diagnosis_name?: string;
}

// Interface สำหรับข้อมูล "ดิบ" ที่รับมาจากหน้าเว็บ (ที่เป็นชื่อ ไม่ใช่ ID)
export interface IProcedureInput {
    service: string;
    procedure: string | null;
    diagnosis: string | null;
    notes: string;
}

// --- แก้ไขโค้ดส่วนนี้ ---
// Interface สำหรับข้อมูล "ผลลัพธ์" ที่จะส่งกลับไปให้ Frontend (มีแต่ชื่อ ไม่มี ID)
export interface IProcedureOutput {
  id?: number; // <<< FIX: เปลี่ยนจาก visit_procedure_id เป็น id
  visit_id: number;
  notes: string | null;
  service_name: string | null;
  procedure_name: string | null;
  diagnosis_name: string | null;
}
