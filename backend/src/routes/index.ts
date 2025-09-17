import { Router } from 'express';
import authRoutes from './auth.route';
import patientRoutes from './patient.route';
import visitsRoutes from './visits.route';
import doctorRoutes from './doctor.routes';
import masterDataRoutes from './masterData.route'; // 👈 เพิ่มบรรทัดนี้

const router = Router();

// ลงทะเบียน Routes ทั้งหมด
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/visits', visitsRoutes);
router.use('/doctors', doctorRoutes);
router.use('/masterdata', masterDataRoutes); // 👈 และเพิ่มบรรทัดนี้

export default router;