import { Router } from 'express';
import { 
    getVisitProcedures, 
    addOrUpdateVisitProcedures // 👈 ต้องมั่นใจว่า Import ตัวนี้มา
} from '../controller/visitProcedures.controller'; // (เช็ค path ให้ตรงกับที่อยู่ไฟล์จริง)

// mergeParams: true เพื่อให้ router ลูกมองเห็น :visit_id จาก router แม่ได้
const router = Router({ mergeParams: true });

// 1. ดึงข้อมูล (GET)
// URL: /api/visits/:visit_id/procedures
router.get('/', getVisitProcedures);

// 2. 🛑 [จุดที่ขาดหายไป] บันทึกข้อมูล (PUT)
// URL: /api/visits/:visit_id/procedures
// ต้องเพิ่มบรรทัดนี้ เพื่อให้ Frontend ยิง PUT เข้ามาได้
router.put('/', addOrUpdateVisitProcedures);

export default router;