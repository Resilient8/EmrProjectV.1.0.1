"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDiagnosis = exports.getAllProcedures = exports.getAllServices = exports.getAllSymptoms = void 0;
// Import Model ทั้งหมดที่เราจะใช้ในไฟล์นี้
const symptom_1 = __importDefault(require("../models/symptom"));
const services_1 = __importDefault(require("../models/services"));
const procedure_1 = __importDefault(require("../models/procedure"));
const diagnosis_1 = __importDefault(require("../models/diagnosis"));
// --- ฟังก์ชันสำหรับดึงข้อมูล "อาการ" ---
const getAllSymptoms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symptoms = yield symptom_1.default.findAll({ order: [['symptom_name', 'ASC']] });
        res.status(200).json(symptoms);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSymptoms = getAllSymptoms;
// --- ฟังก์ชันสำหรับดึงข้อมูล "บริการ" ---
const getAllServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield services_1.default.findAll({ order: [['service_name', 'ASC']] });
        res.status(200).json(services);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllServices = getAllServices;
// --- ฟังก์ชันสำหรับดึงข้อมูล "หัตถการ" ---
const getAllProcedures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const procedures = yield procedure_1.default.findAll({ order: [['procedure_name', 'ASC']] });
        res.status(200).json(procedures);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProcedures = getAllProcedures;
// --- ฟังก์ชันสำหรับดึงข้อมูล "การวินิจฉัย" ---
const getAllDiagnosis = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diagnosis = yield diagnosis_1.default.findAll({ order: [['diagnosis_name', 'ASC']] });
        res.status(200).json(diagnosis);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllDiagnosis = getAllDiagnosis;
