// ในไฟล์ src/routes/auth.route.ts
import { Router } from 'express';
// ชื่อฟังก์ชันอาจเป็น registerUser หรือ signup ก็ได้ ขึ้นอยู่กับไฟล์ controller ของคุณ
import { registerUser, loginUser } from '../controller/authController';

const router = Router();

// --- แก้ไขบรรทัดนี้ ---
// เปลี่ยนจาก '/register' เป็น '/signup'
router.post('/signup', registerUser);
// --------------------

// กำหนดเส้นทางสำหรับ Login
router.post('/login', loginUser);

export default router;