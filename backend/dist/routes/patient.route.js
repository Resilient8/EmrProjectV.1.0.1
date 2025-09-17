"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// 👇 Just remove the 's' from 'controllers' here
const patientController_1 = require("../controller/patientController");
const router = (0, express_1.Router)();
router.get("/registry", patientController_1.getPatientRegistry);
router.get("/", patientController_1.getAllPatients);
router.get("/:id", patientController_1.getPatientById);
router.post("/", patientController_1.createPatient);
router.put("/:id", patientController_1.updatePatient);
router.delete("/:id", patientController_1.deletePatientById);
router.put("/:id/status", patientController_1.updatePatientStatus);
exports.default = router;
