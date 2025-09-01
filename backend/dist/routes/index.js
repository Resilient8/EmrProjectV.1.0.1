"use strict";
// ในไฟล์ src/routes/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const patient_route_1 = __importDefault(require("./patient.route"));
const visits_route_1 = __importDefault(require("./visits.route"));
const router = (0, express_1.Router)();
// ลงทะเบียน Routes ทั้งหมด
router.use('/auth', auth_route_1.default);
router.use('/patients', patient_route_1.default);
router.use('/visits', visits_route_1.default);
exports.default = router;
