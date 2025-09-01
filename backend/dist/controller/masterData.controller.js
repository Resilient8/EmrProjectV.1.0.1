"use strict";
// สร้าง/แก้ไขไฟล์ที่: src/controller/masterData.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDiagnosis = exports.getAllProcedures = exports.getAllServices = void 0;
const db_1 = require("../config/db"); // <-- เพิ่มบรรทัดนี้เข้าไป
const getAllServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.pool.query('SELECT * FROM Services');
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllServices = getAllServices;
const getAllProcedures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.pool.query('SELECT * FROM Procedures');
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProcedures = getAllProcedures;
const getAllDiagnosis = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.pool.query('SELECT * FROM Diagnosis');
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllDiagnosis = getAllDiagnosis;
