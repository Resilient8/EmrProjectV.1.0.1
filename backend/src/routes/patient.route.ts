import { Router } from "express";
import {
    getPatientRegistry,
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatientById,
    updatePatientStatus,
    getPatientRecordById,
    updatePatientAvatar // <--- 1. ต้องไปสร้างและ Import ฟังก์ชันนี้มาจาก Controller ด้วยนะครับ
} from '../controller/patientController';

import { upload } from '../middleware/upload'; 

const router = Router();

router.get("/registry", getPatientRegistry);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);

router.post("/", upload.single('avatar'), createPatient);

// 🔥 2. เพิ่ม Route นี้เข้าไปเพื่อแก้ 404 ครับ
router.post("/:id/avatar", upload.single('avatar'), updatePatientAvatar);

router.put("/:id", updatePatient);
router.delete("/:id", deletePatientById);
router.put("/:id/status", updatePatientStatus);
router.get("/:id/record", getPatientRecordById);

export default router;