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
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // ใช้ bcryptjs จะจัดการเรื่อง async ได้ง่ายกว่า
const db_1 = __importDefault(require("../db")); // << ตรวจสอบ path การ import ไฟล์เชื่อมต่อ DB ของคุณให้ถูกต้อง
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // --- จุดที่ 1: แก้ไขการรับข้อมูล ---
        // เปลี่ยนชื่อตัวแปรให้ตรงกับที่ Frontend ส่งมา (camelCase)
        const { prefix, firstName, lastName, email, password, userType, licenseNumber, workplace, department, position } = req.body;
        // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือยัง
        const [existingUsers] = yield db_1.default.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "มีอีเมลนี้อยู่ในระบบแล้ว" });
        }
        // Hash รหัสผ่าน
        const saltRounds = 10;
        const password_hash = yield bcryptjs_1.default.hash(password, saltRounds);
        // --- จุดที่ 2: แก้ไขการสร้าง Object ---
        // เตรียมข้อมูลเพื่อบันทึก โดยจับคู่ตัวแปร camelCase กับชื่อคอลัมน์ snake_case
        const newUser = {
            prefix: prefix,
            first_name: firstName, // <-- ใช้ firstName ที่รับมา
            last_name: lastName, // <-- ใช้ lastName ที่รับมา
            email: email,
            password_hash: password_hash,
            role: userType, // <-- ใช้ userType ที่รับมา
            license_number: licenseNumber, // สมมติว่าชื่อคอลัมน์ใน DB คือ license_number
            workplace: workplace,
            department: department,
            position: position
        };
        // บันทึกผู้ใช้ใหม่ลงฐานข้อมูล
        yield db_1.default.query('INSERT INTO users SET ?', newUser);
        res.status(201).json({ message: 'ลงทะเบียนสำเร็จ!' });
    }
    catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ระหว่างการลงทะเบียน" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [rows] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        delete user.password_hash;
        res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user: user
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ระหว่างการเข้าสู่ระบบ" });
    }
});
exports.loginUser = loginUser;
