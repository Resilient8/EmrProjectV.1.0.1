"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ในไฟล์ src/routes/auth.route.ts
const express_1 = require("express");
// ชื่อฟังก์ชันอาจเป็น registerUser หรือ signup ก็ได้ ขึ้นอยู่กับไฟล์ controller ของคุณ
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
// --- แก้ไขบรรทัดนี้ ---
// เปลี่ยนจาก '/register' เป็น '/signup'
router.post('/signup', authController_1.registerUser);
// --------------------
// กำหนดเส้นทางสำหรับ Login
router.post('/login', authController_1.loginUser);
exports.default = router;
