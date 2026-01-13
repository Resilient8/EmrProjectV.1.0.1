import { Router } from 'express';
import authRoutes from './auth.route';
import patientRoutes from './patient.route';
import visitsRoutes from './visits.route';
import doctorRoutes from './doctor.routes';
import masterDataRoutes from './masterData.route';
// ✅ 1. เพิ่มบรรทัดนี้: Import ไฟล์ Route ของ User
import userRoutes from './user.route'; 

const router = Router();

// ลงทะเบียน Routes ทั้งหมด
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/visits', visitsRoutes);
router.use('/doctors', doctorRoutes);
router.use('/masterdata', masterDataRoutes);

// ✅ 2. เพิ่มบรรทัดนี้: เปิดใช้งานเส้นทาง /users
router.use('/users', userRoutes); 

export default router;