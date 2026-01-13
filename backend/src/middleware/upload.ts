import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. ตรวจสอบว่ามีโฟลเดอร์ uploads หรือไม่ ถ้าไม่มีให้สร้างใหม่
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. ตั้งค่าการจัดเก็บไฟล์ (DiskStorage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // เก็บไฟล์ลงในโฟลเดอร์ 'uploads' (ที่อยู่ระดับเดียวกับ src)
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์ใหม่ป้องกันชื่อซ้ำ: patient-{เวลา}-{เลขสุ่ม}.นามสกุลเดิม
        // ตัวอย่าง: patient-1715698822-9988.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'patient-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. ตัวกรองไฟล์ (รับเฉพาะรูปภาพ)
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // อนุญาต
    } else {
        cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น (Image only)!'), false); // ปฏิเสธ
    }
};

// 4. Export ตัว upload middleware
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // จำกัดขนาดไฟล์ไม่เกิน 5MB
    }
});