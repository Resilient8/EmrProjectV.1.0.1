// backend/src/routes/visitDiagnosis.route.ts
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware'; // หรือ middleware ที่พี่ใช้
import * as controller from '../controller/visitDiagnosis.controller';

const router = Router();

// บันทึกวินิจฉัย (ต้อง Login ก่อน)
router.post('/', authenticateToken, controller.createVisitDiagnoses);

// ดึงประวัติวินิจฉัยของ Visit นั้นๆ
router.get('/:visitId', authenticateToken, controller.getByVisitId);

export default router;