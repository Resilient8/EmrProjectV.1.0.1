import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // ใช้ bcryptjs จะจัดการเรื่อง async ได้ง่ายกว่า
import pool from '../db'; // << ตรวจสอบ path การ import ไฟล์เชื่อมต่อ DB ของคุณให้ถูกต้อง

export const registerUser = async (req: Request, res: Response) => {
  try {
    // --- จุดที่ 1: แก้ไขการรับข้อมูล ---
    // เปลี่ยนชื่อตัวแปรให้ตรงกับที่ Frontend ส่งมา (camelCase)
    const {
      prefix,
      firstName,
      lastName,
      email,
      password,
      userType,
      licenseNumber,
      workplace,
      department,
      position
    } = req.body;

    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือยัง
    const [existingUsers]: any = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "มีอีเมลนี้อยู่ในระบบแล้ว" });
    }

    // Hash รหัสผ่าน
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // --- จุดที่ 2: แก้ไขการสร้าง Object ---
    // เตรียมข้อมูลเพื่อบันทึก โดยจับคู่ตัวแปร camelCase กับชื่อคอลัมน์ snake_case
    const newUser = {
      prefix: prefix,
      first_name: firstName,      // <-- ใช้ firstName ที่รับมา
      last_name: lastName,        // <-- ใช้ lastName ที่รับมา
      email: email,
      password_hash: password_hash,
      role: userType,             // <-- ใช้ userType ที่รับมา
      license_number: licenseNumber, // สมมติว่าชื่อคอลัมน์ใน DB คือ license_number
      workplace: workplace,
      department: department,
      position: position
    };

    // บันทึกผู้ใช้ใหม่ลงฐานข้อมูล
    await pool.query('INSERT INTO users SET ?', newUser);

    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ!' });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ระหว่างการลงทะเบียน" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    
    delete user.password_hash;
    
    res.status(200).json({ 
      message: 'เข้าสู่ระบบสำเร็จ', 
      user: user 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์ระหว่างการเข้าสู่ระบบ" });
  }
};
