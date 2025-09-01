// ในไฟล์ src/routes/visits.route.ts

import { Router } from "express";
import visitsController from "../controller/visits.controller";
// --- 1. Import Controller สำหรับ "บันทึก" symptoms ---
import { addVisitSymptoms } from "../controller/visitSymptoms.controller";
import { getVisitProcedures, addOrUpdateVisitProcedures } from "../controller/visitProcedures.controller";
import { getAllServices, getAllProcedures, getAllDiagnosis } from "../controller/masterData.controller";

const router = Router();

// --- Routes สำหรับข้อมูล Visit หลัก ---
router.get("/", visitsController.getAllVisits);
router.post("/", visitsController.createVisit);
router.get("/patient/:patientId", visitsController.getVisitsByPatientId);

// --- Routes สำหรับข้อมูล Master ---
router.get("/master/services", getAllServices);
router.get("/master/procedures", getAllProcedures);
router.get("/master/diagnosis", getAllDiagnosis);

// --- Routes สำหรับข้อมูลย่อยของ Visit (ตาม ID) ---
router.get("/:visit_id", visitsController.getVisitById);
router.put("/:visit_id", visitsController.updateVisit);

// GET สำหรับ "ดึง" symptoms
router.get("/:visit_id/symptoms", visitsController.getVisitSymptoms);
// --- 2. เพิ่ม POST สำหรับ "บันทึก" symptoms ---
router.post("/:visit_id/symptoms", addVisitSymptoms);

// GET และ POST สำหรับ procedures
router.get("/:visit_id/procedures", getVisitProcedures);
router.post("/:visit_id/procedures", addOrUpdateVisitProcedures);

export default router;
