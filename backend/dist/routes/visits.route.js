"use strict";
// ในไฟล์ src/routes/visits.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visits_controller_1 = __importDefault(require("../controller/visits.controller"));
// --- 1. Import Controller สำหรับ "บันทึก" symptoms ---
const visitSymptoms_controller_1 = require("../controller/visitSymptoms.controller");
const visitProcedures_controller_1 = require("../controller/visitProcedures.controller");
const masterData_controller_1 = require("../controller/masterData.controller");
const router = (0, express_1.Router)();
// --- Routes สำหรับข้อมูล Visit หลัก ---
router.get("/", visits_controller_1.default.getAllVisits);
router.post("/", visits_controller_1.default.createVisit);
router.get("/patient/:patientId", visits_controller_1.default.getVisitsByPatientId);
// --- Routes สำหรับข้อมูล Master ---
router.get("/master/services", masterData_controller_1.getAllServices);
router.get("/master/procedures", masterData_controller_1.getAllProcedures);
router.get("/master/diagnosis", masterData_controller_1.getAllDiagnosis);
// --- Routes สำหรับข้อมูลย่อยของ Visit (ตาม ID) ---
router.get("/:visit_id", visits_controller_1.default.getVisitById);
router.put("/:visit_id", visits_controller_1.default.updateVisit);
// GET สำหรับ "ดึง" symptoms
router.get("/:visit_id/symptoms", visits_controller_1.default.getVisitSymptoms);
// --- 2. เพิ่ม POST สำหรับ "บันทึก" symptoms ---
router.post("/:visit_id/symptoms", visitSymptoms_controller_1.addVisitSymptoms);
// GET และ POST สำหรับ procedures
router.get("/:visit_id/procedures", visitProcedures_controller_1.getVisitProcedures);
router.post("/:visit_id/procedures", visitProcedures_controller_1.addOrUpdateVisitProcedures);
exports.default = router;
