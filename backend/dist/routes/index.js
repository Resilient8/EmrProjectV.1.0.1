"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const patient_route_1 = __importDefault(require("./patient.route"));
const visits_route_1 = __importDefault(require("./visits.route"));
const doctor_routes_1 = __importDefault(require("./doctor.routes"));
const masterData_route_1 = __importDefault(require("./masterData.route")); // 👈 เพิ่มบรรทัดนี้
const router = (0, express_1.Router)();
// ลงทะเบียน Routes ทั้งหมด
router.use('/auth', auth_route_1.default);
router.use('/patients', patient_route_1.default);
router.use('/visits', visits_route_1.default);
router.use('/doctors', doctor_routes_1.default);
router.use('/masterdata', masterData_route_1.default); // 👈 และเพิ่มบรรทัดนี้
exports.default = router;
