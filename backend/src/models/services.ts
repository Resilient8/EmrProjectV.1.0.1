// src/models/service.ts

export interface Service {
    service_id: number;
    service_name: string;
    // ถ้าคุณมีคอลัมน์ category_id หรืออื่นๆ ในตาราง Services ใน DB
    // และต้องการใช้ใน Backend Model ด้วย ก็สามารถเพิ่มเข้ามาได้
    category_id?: number;
    description?: string; // ถ้ามีใน DB
    cost?: number; // ถ้ามีใน DB
}