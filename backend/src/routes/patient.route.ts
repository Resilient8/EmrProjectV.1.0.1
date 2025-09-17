import { Router } from "express";
// 👇 Just remove the 's' from 'controllers' here
import {
    getPatientRegistry,
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatientById,
    updatePatientStatus
} from '../controller/patientController';

const router = Router();

router.get("/registry", getPatientRegistry);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatientById);
router.put("/:id/status", updatePatientStatus);

export default router;