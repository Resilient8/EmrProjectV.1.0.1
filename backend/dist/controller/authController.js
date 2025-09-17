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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// --- 1. แก้ไขการ Import ---
// Import db object ที่มีทุกอย่างเข้ามา
const db_1 = __importDefault(require("../db"));
// ดึง Model และ sequelize ที่ต้องใช้ออกมา
const { User, Doctor, Pharmacist, Department, sequelize } = db_1.default;
// --- 2. ฟังก์ชัน Register (แก้ไขใหม่ทั้งหมด) ---
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // รับข้อมูลจาก frontend
    const { prefix, firstName, lastName, email, password, role, // 'Doctor', 'Nurse', 'Admin', 'Pharmacist'
    licenseNumber, specialization, // เฉพาะ Doctor
    department // ชื่อแผนกของ Doctor
     } = req.body;
    // เริ่ม Transaction เพื่อให้แน่ใจว่าทุกอย่างสำเร็จหรือล้มเหลวไปพร้อมกัน
    const t = yield sequelize.transaction();
    try {
        // ตรวจสอบอีเมลซ้ำ
        const existingUser = yield User.findOne({ where: { email: email } });
        if (existingUser) {
            yield t.rollback(); // ยกเลิก transaction
            return res.status(409).json({ message: "มีอีเมลนี้อยู่ในระบบแล้ว" });
        }
        // Hash รหัสผ่าน
        const password_hash = yield bcryptjs_1.default.hash(password, 10);
        // สร้างข้อมูลในตาราง users หลัก
        const newUser = yield User.create({
            prefix: prefix,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password_hash: password_hash,
            role: role
        }, { transaction: t });
        // ถ้า Role เป็น Doctor ให้สร้างข้อมูลในตาราง doctors ด้วย
        if (role === 'Doctor') {
            // ค้นหา department_id จากชื่อ department ที่ส่งมา
            const departmentRecord = yield Department.findOne({ where: { name: department } });
            if (!departmentRecord) {
                yield t.rollback();
                return res.status(400).json({ message: `ไม่พบแผนกที่ชื่อว่า '${department}'` });
            }
            yield Doctor.create({
                user_id: newUser.user_id, // ใช้ ID จาก user ที่เพิ่งสร้าง
                license_number: licenseNumber,
                specialization: specialization,
                department_id: departmentRecord.id
            }, { transaction: t });
        }
        // ถ้า Role เป็น Pharmacist ให้สร้างข้อมูลในตาราง pharmacists ด้วย
        if (role === 'Pharmacist') {
            yield Pharmacist.create({
                user_id: newUser.user_id, // ใช้ ID จาก user ที่เพิ่งสร้าง
                license_number: licenseNumber
            }, { transaction: t });
        }
        // ถ้าทุกอย่างสำเร็จ บันทึก Transaction
        yield t.commit();
        res.status(201).json({ message: 'ลงทะเบียนสำเร็จ!', userId: newUser.user_id });
    }
    catch (error) {
        // ถ้ามีขั้นตอนไหนพลาด ให้ยกเลิกทั้งหมด
        yield t.rollback();
        console.error("Register Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ระหว่างการลงทะเบียน" });
    }
});
exports.registerUser = registerUser;
// --- 3. ฟังก์ชัน Login (ปรับปรุง) ---
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // ค้นหาผู้ใช้ พร้อมดึงข้อมูลเฉพาะทางมาด้วยถ้ามี
        const user = yield User.findOne({
            where: { email: email },
            include: [
                { model: Doctor, as: 'doctorInfo', include: [Department] }, // ดึงข้อมูล Doctor และ Department
                { model: Pharmacist, as: 'pharmacistInfo' } // ดึงข้อมูล Pharmacist
            ]
        });
        if (!user) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        // เปรียบเทียบรหัสผ่าน
        const isMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        // สร้าง JSON Web Token (JWT)
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET || 'your_default_secret_key', { expiresIn: '1h' });
        // แปลงข้อมูล user และลบรหัสผ่านก่อนส่งกลับ
        const userResponse = user.toJSON();
        delete userResponse.password_hash;
        res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user: userResponse,
            token: token
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ระหว่างการเข้าสู่ระบบ" });
    }
});
exports.loginUser = loginUser;
