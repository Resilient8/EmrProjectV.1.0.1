// สร้างไฟล์ใหม่ที่: src/models/visitSymptoms.ts
// แล้วคัดลอกโค้ดทั้งหมดนี้ไปวาง

// Interface นี้ใช้สำหรับระบุโครงสร้างของข้อมูลในตาราง VisitSymptoms
// ซึ่งจะตรงกับคอลัมน์ในฐานข้อมูล
export interface IVisitSymptom {
    SymptomID?: number; // Primary Key, อาจจะเป็น id หรือ SymptomID
    VisitID: number; // Foreign Key, อาจจะเป็น visit_id หรือ VisitID
    ChiefComplaint?: string | null;
    PresentIllness?: string | null;
    ROS_General?: string | null;      // ในฐานข้อมูลจะเก็บเป็น JSON string
    ROS_HeadAndNeck?: string | null;  // ในฐานข้อมูลจะเก็บเป็น JSON string
    ROS_Respiratory?: string | null;  // ในฐานข้อมูลจะเก็บเป็น JSON string
    ROS_Cardiovascular?: string | null;// ในฐานข้อมูลจะเก็บเป็น JSON string
    ROS_Gastrointestinal?: string | null; // ในฐานข้อมูลจะเก็บเป็น JSON string
    ROS_Skin?: string | null;         // ในฐานข้อมูลจะเก็บเป็น JSON string
}
