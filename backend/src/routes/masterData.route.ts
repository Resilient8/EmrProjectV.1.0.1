import { Router } from 'express';
import {
    getAllSymptoms,
    getAllServices,
    getAllProcedures,
    getAllDiagnosis,
    getAllMedications // [เพิ่ม] Import ฟังก์ชันยา
} from '../controller/masterData.controller';

const router = Router();

router.get('/symptoms', getAllSymptoms);
router.get('/services', getAllServices);
router.get('/procedures', getAllProcedures);
router.get('/diagnosis', getAllDiagnosis);
router.get('/medications', getAllMedications); // [เพิ่ม] เส้นทางสำหรับยา

export default router;