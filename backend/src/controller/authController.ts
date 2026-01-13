import { Request, Response } from 'express';
import User from '../models/user'; // ตรวจสอบว่า path นี้ตรงกับไฟล์ User Model ของคุณ
import { Op } from 'sequelize';

// =========================================================
// ✅ ฟังก์ชัน Register (ลงทะเบียน)
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
    // ⚠️ หมายเหตุ: ใน Production ควรใช้ bcrypt hash password ก่อนบันทึก
    const newUser = await User.create({
      prefix,
      first_name,
      last_name,
      email,
      phone,
      password_hash: password, 
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
// ✅ ฟังก์ชัน Login (แบบ Super Debug 🛠️)
// =========================================================
export const login = async (req: Request, res: Response) => {
  try {
    console.log("------------------------------------------------");
    console.log("📥 1. Login Process Started");
    console.log("📥 Payload received:", req.body);

    const { email, username, password } = req.body;
    
    // 1. แปลงให้เป็นตัวพิมพ์เล็ก และตัดช่องว่างหน้าหลัง (Trim)
    // เพื่อให้ avatar01@... กับ Avatar01@... ถือเป็นอันเดียวกัน
    const loginIdentifier = (email || username || '').trim(); // เอา .toLowerCase() ออกก่อนเผื่อใน DB คุณเก็บตัวใหญ่

    console.log(`🔎 2. Searching User by Identifier: "${loginIdentifier}"`);

    if (!loginIdentifier) {
        console.log("❌ Missing identifier (No email/username provided)");
        return res.status(400).json({ message: 'กรุณาระบุ Email หรือ Username' });
    }

    // 2. ค้นหา User (ใช้ loginIdentifier หาในช่อง email)
    const user = await User.findOne({ 
        where: { email: loginIdentifier } 
    });

    // 🛑 เช็คจุดที่ 1: เจอ User ในฐานข้อมูลไหม?
    if (!user) {
        console.log("❌ User Not Found in Database!");
        
        // แอบดูข้อมูลใน DB หน่อยว่ามีใครบ้าง (เอามา 5 คนแรก)
        const allUsers = await User.findAll({ limit: 5, attributes: ['email', 'role'] });
        console.log("💡 Tips: รายชื่อที่มีอยู่ใน DB ตอนนี้:", allUsers.map(u => `${u.email} (${u.role})`));
        
        return res.status(401).json({ message: 'ไม่พบผู้ใช้งานนี้ในระบบ' });
    }

    console.log("✅ User Found:", user.email);
    console.log("🔑 Password stored in DB:", user.password_hash);
    console.log("🔑 Password sent from Client:", password);

    // 🛑 เช็คจุดที่ 2: รหัสผ่านตรงไหม?
    // (หมายเหตุ: ถ้าคุณเข้ารหัสด้วย bcrypt ต้องเปลี่ยนบรรทัดนี้เป็น bcrypt.compare)
    if (user.password_hash !== password) {
        console.log("❌ Password Mismatch! (รหัสผ่านไม่ตรง)");
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    console.log("✅ Login Success! Generating Response...");

    // 3. Login สำเร็จ -> ส่งข้อมูลกลับ
    res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
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
    console.error('🔥 Login Exception (Code 500):', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
  }
};