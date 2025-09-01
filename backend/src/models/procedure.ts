// src/models/procedure.ts

export interface Procedure {
    procedure_id: number;
    procedure_name: string;
    // ถ้าคุณมีคอลัมน์ category_id หรืออื่นๆ ในตาราง Procedures ใน DB
    // ก็สามารถเพิ่มเข้ามาได้
    category_id?: number;
    description?: string; // ถ้ามีใน DB
}