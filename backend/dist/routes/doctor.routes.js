"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/doctor.routes.ts
const express_1 = require("express");
const doctor_controller_1 = require("../controller/doctor.controller");
const router = (0, express_1.Router)();
// GET /api/doctors/
router.get('/', doctor_controller_1.getAllDoctors);
exports.default = router;
