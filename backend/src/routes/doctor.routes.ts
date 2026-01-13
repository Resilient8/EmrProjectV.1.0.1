import { Router } from 'express';
// 💥 [แก้ไข] เพิ่ม getDoctorActiveDates เข้ามาใน import ด้วย
import { 
    getAllDoctors, 
    getPatientQueue, 
    getAvailableDates, 
    getDoctorActiveDates // <--- ตัวนี้สำคัญสำหรับจุดสีเขียว
} from '../controller/doctor.controller';

const router = Router();

// (ของเดิม)
router.get('/', getAllDoctors);

// (ของเดิม)
router.get('/patient-queue', getPatientQueue);

// 💥 [เพิ่ม] API สำหรับ "Dropdown เลือกวัน" (มีวันที่ + count)
router.get('/available-dates', getAvailableDates);

// 💥 [เพิ่ม] API สำหรับ "จุดสีเขียวในปฏิทิน" (Frontend ยิงมาที่ /active-dates)
router.get('/active-dates', getDoctorActiveDates);

export default router;