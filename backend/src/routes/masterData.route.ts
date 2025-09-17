import { Router } from 'express';
import {
    getAllSymptoms,
    getAllServices,
    getAllProcedures,
    getAllDiagnosis
} from '../controller/masterData.controller';

const router = Router();

router.get('/symptoms', getAllSymptoms);
router.get('/services', getAllServices);
router.get('/procedures', getAllProcedures);
router.get('/diagnosis', getAllDiagnosis);

export default router;