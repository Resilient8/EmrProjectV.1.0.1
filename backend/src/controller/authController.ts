import { Request, Response } from 'express';
import User from '../models/user'; 
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken'; 

// =========================================================
// ✅ ฟังก์ชัน Register
// =========================================================
export const register = async (req: Request, res: Response) => {
  try {
    console.log("📥 Register Request:", req.body);
    const { prefix, first_name, last_name, email, phone, password, role } = req.body;

    // เช็คว่ามี User นี้อยู่แล้วหรือไม่
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    // สร้าง User ใหม่
    const newUser = await User.create({
      prefix,
      first_name,
      last_name,
      email,
      phone,
      password_hash: password, // ใช้ password ตรงๆ (Dev Mode)
      role
    });

    console.log("✅ Register Success:", newUser.email);
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', user: newUser });

  } catch (error: any) {
    console.error('🔥 Register Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
  }
};

// =========================================================
// ✅ ฟังก์ชัน Login (แก้เวลา Token แล้ว)
// =========================================================
export const login = async (req: Request, res: Response) => {
  try {
    console.log("------------------------------------------------");
    console.log("📥 1. Login Process Started");

    const { email, username, password } = req.body;
    const loginIdentifier = (email || username || '').trim();

    if (!loginIdentifier) {
        return res.status(400).json({ message: 'กรุณาระบุ Email หรือ Username' });
    }

    // 1. ค้นหา User
    const user = await User.findOne({ 
        where: { email: loginIdentifier } 
    });

    if (!user) {
        return res.status(401).json({ message: 'ไม่พบผู้ใช้งานนี้ในระบบ' });
    }

    // 2. เช็ค Password
    if (user.password_hash !== password) {
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    console.log("✅ Login Success! Generating Token...");

    // 3. สร้าง Token (แจกบัตรผ่านทาง)
    const secretKey = process.env.JWT_SECRET || 'secret_key';
    
    const token = jwt.sign(
        { 
            userId: user.user_id, 
            email: user.email, 
            role: user.role 
        },
        secretKey,
        // 🔥🔥🔥 แก้ตรงนี้: เปลี่ยนจาก '1d' เป็น '30d' (อยู่ได้ 30 วัน) 🔥🔥🔥
        { expiresIn: '30d' } 
    );

    // 4. ส่งข้อมูลกลับ
    res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token: token, 
      user: {
        id: user.user_id,
        email: user.email,
        prefix: user.prefix,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        department: user.department,
        avatar_url: user.avatar_url
      }
    });

  } catch (error: any) {
    console.error('🔥 Login Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
  }
};