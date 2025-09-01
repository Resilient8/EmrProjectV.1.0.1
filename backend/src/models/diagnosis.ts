// src/models/diagnosis.ts

export interface Diagnosis {
    diagnosis_id: number;
    diagnosis_name: string;
    // ถ้าคุณมีคอลัมน์ category_id หรืออื่นๆ ในตาราง Diagnosis ใน DB
    // ก็สามารถเพิ่มเข้ามาได้
    category_id?: number;
    icd_code?: string; // ถ้ามีใน DB
}