import { Router } from "express";
import patientController from "../controller/patientController"; // import controller สำหรับผู้ป่วย

const router = Router();

// เพิ่ม Route ใหม่สำหรับหน้าทะเบียนผู้ป่วย ควรวางไว้บนๆ
router.get("/registry", patientController.getPatientRegistry);

// กำหนด routes ต่างๆ สำหรับผู้ป่วย
router.get("/", patientController.getAllPatients);
router.get("/:id", patientController.getPatientById);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatientById);

// เพิ่ม Route ใหม่สำหรับอัปเดต "สถานะ" ผู้ป่วยโดยเฉพาะ
// URL: PUT /api/patients/:id/status
router.put("/:id/status", patientController.updatePatientStatus);

export default router;
