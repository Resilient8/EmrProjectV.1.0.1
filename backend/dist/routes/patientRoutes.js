"use strict";
// src/routes/patientRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controller/patientController");
const router = express_1.default.Router();
// กำหนด routes ต่างๆ
router.get('/', patientController_1.default.getAllPatients);
router.get('/:id', patientController_1.default.getPatientById);
router.post('/', patientController_1.default.createPatient);
router.put('/:id', patientController_1.default.updatePatient);
router.delete('/:id', patientController_1.default.deletePatientById);
exports.default = router;
