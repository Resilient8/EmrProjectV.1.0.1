// ในไฟล์ src/routes/index.ts

import { Router } from 'express';
import authRoutes from './auth.route';
import patientRoutes from './patient.route';
import visitsRoutes from './visits.route';


const router = Router();

// ลงทะเบียน Routes ทั้งหมด
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/visits', visitsRoutes);


export default router;
