// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ขยาย Interface Request ให้มี user
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. รับ Token จาก Header (Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. ถ้าไม่มี Token ส่งมาเลย -> 401 Unauthorized
    if (!token) {
      console.log('🚫 [Auth] No token provided');
      return res.status(401).json({ message: 'Access token required' });
    }

    // 3. ตรวจสอบ Token (Verify)
    // 🔥 ข้อควรระวัง: process.env.JWT_SECRET ต้องตรงกับตอน Login เป๊ะๆ
    const secret = process.env.JWT_SECRET || 'secret_key'; 

    jwt.verify(token, secret, (err: any, user: any) => {
      // 4. ถ้า Token ผิด/หมดอายุ -> 403 Forbidden
      if (err) {
        console.error('🚫 [Auth] Token verification failed:', err.message);
        
        // ถ้าเป็นแอดมินหรืออยากให้ผ่าน (เพื่อ Test) อาจจะแก้ตรงนี้ (แต่ไม่แนะนำสำหรับ Production)
        // ถ้าอยากให้แอดมินทำได้หมด ต้องไปแก้ที่ตัว Role Middleware ไม่ใช่ที่นี่ครับ 
        // ที่นี่คือด่านตรวจบัตรประชาชน (ยืนยันตัวตน) ต้องผ่านทุกคนครับ
        
        return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
      }

      // 5. ผ่านฉลุย -> แนบข้อมูล User ไปต่อ
      (req as any).user = user;
      
      // ✅ Debug: ดูว่าใคร Login เข้ามา
      // console.log('✅ [Auth] User verified:', user.userId || user.id, '| Role:', user.role);
      
      next();
    });

  } catch (error) {
    console.error('🔥 [Auth] Middleware Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};