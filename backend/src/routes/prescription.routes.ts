import { Router } from 'express';
// import ฟังก์ชัน getPrescriptionsByVisitId ที่เพิ่งสร้างเข้ามาด้วย
import { savePrescriptions, getPrescriptionsByVisitId } from '../controller/prescription.controller';

const router = Router();

// URL: /api/prescriptions/visit/:visit_id

// 1. สำหรับบันทึก (หน้าหมอ)
router.post('/visit/:visit_id', savePrescriptions);

// 2. [เพิ่มใหม่] สำหรับดึงข้อมูล (หน้าหมอ และ หน้าเภสัช)
router.get('/visit/:visit_id', getPrescriptionsByVisitId);

export default router;