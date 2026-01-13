import { Router } from 'express';
// Import Controller ที่เราเพิ่งเขียนตะกี้
import { getUsers, getUserById } from '../controller/user.controller';

const router = Router();

// GET http://localhost:3000/api/users
router.get('/', getUsers);

// GET http://localhost:3000/api/users/1 (เผื่อใช้ในอนาคต)
router.get('/:id', getUserById);

export default router;