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
exports.getAllDoctors = void 0;
// --- 1. แก้ไขการ Import ---
const db_1 = __importDefault(require("../db"));
const { Doctor, User, Department } = db_1.default; // Import Models ที่จำเป็นทั้งหมด
const getAllDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // --- 2. แก้ไข Query ---
        // ค้นหาจาก Model `Doctor` โดยตรง และใช้ include เพื่อดึงข้อมูลที่เกี่ยวข้อง
        const doctors = yield Doctor.findAll({
            include: [
                {
                    model: User,
                    attributes: ['prefix', 'first_name', 'last_name'] // เลือกเฉพาะข้อมูลที่จำเป็น
                },
                {
                    model: Department,
                    attributes: ['name']
                }
            ],
            order: [
                [User, 'first_name', 'ASC'] // เรียงตามชื่อแพทย์
            ]
        });
        // --- 3. แก้ไขการจัดรูปแบบข้อมูล ---
        // แปลงข้อมูลให้เป็น Format ที่ Frontend ต้องการ
        const formattedDoctors = doctors.map(doc => {
            // ตรวจสอบข้อมูลก่อนใช้งานเพื่อความปลอดภัย
            const user = doc.User || {};
            const department = doc.Department || {};
            return {
                id: doc.user_id,
                name: `${user.prefix || ''} ${user.first_name || ''} ${user.last_name || ''}`.trim(),
                department: department.name || 'N/A'
            };
        });
        res.status(200).json(formattedDoctors);
    }
    catch (error) {
        console.error("Error fetching doctors:", error); // Log error ที่ละเอียดขึ้น
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
});
exports.getAllDoctors = getAllDoctors;
