import { Router } from 'express';
import { getICD10List } from '../controller/icd10.controller';

const router = Router();

// GET /api/icd10?search=ไข้หวัด
router.get('/', getICD10List);

export default router;