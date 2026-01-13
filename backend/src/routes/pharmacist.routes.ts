import { Router } from 'express';
// 1. [เพิ่ม] getActiveDates เข้ามาใน import
import { 
    getPharmacyQueue, 
    getDispenseDetails, 
    confirmDispense, 
    updateDispenseProcess,
    getActiveDates // <--- เพิ่มตัวนี้ (เดี๋ยวไปสร้างใน Controller)
} from '../controller/pharmacist.controller';

const router = Router();

// 2. [เพิ่ม] Route นี้สำหรับเช็ควันที่มีข้อมูล (เพื่อทำจุดสีเขียว)
router.get('/active-dates', getActiveDates); 

router.get('/queue', getPharmacyQueue);              // ดูคิวรายวัน
router.get('/visit/:visitId', getDispenseDetails);   // ดูรายละเอียด
router.post('/dispense/:visitId', confirmDispense);  // ยืนยันจ่ายยา
router.post('/update-process/:visitId', updateDispenseProcess); // Auto-save

export default router;