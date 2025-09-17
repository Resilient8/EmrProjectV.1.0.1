// src/routes/doctor.routes.ts
import { Router } from 'express';
import { getAllDoctors } from '../controller/doctor.controller';

const router = Router();

// GET /api/doctors/
router.get('/', getAllDoctors);

export default router;