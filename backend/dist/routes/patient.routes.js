"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = __importDefault(require("../controller/patientController")); // import controller สำหรับผู้ป่วย
const router = (0, express_1.Router)();
// กำหนด routes ต่างๆ สำหรับผู้ป่วย
router.get("/", patientController_1.default.getAllPatients);
router.get("/:id", patientController_1.default.getPatientById);
router.post("/", patientController_1.default.createPatient);
router.put("/:id", patientController_1.default.updatePatient);
router.delete("/:id", patientController_1.default.deletePatientById);
exports.default = router;
