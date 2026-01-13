import { Router } from 'express';
// 🔥 แก้ชื่อ Import ให้ตรงกับ Controller (register, login)
import { register, login } from '../controller/authController';

const router = Router();

// ✅ ใช้ '/register' เพื่อให้ตรงกับ Frontend ที่เราเขียนไว้
router.post('/register', register);

// ✅ Login
router.post('/login', login);

export default router;