import { Request, Response } from 'express';
// ✅ Import Model ที่คุณมี (ตรวจสอบ path ให้ตรงกับโครงสร้างจริงของคุณ)
import User from '../models/user'; 

// ฟังก์ชันดึงรายชื่อผู้ใช้งานทั้งหมด (สำหรับหน้า Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    // ดึงข้อมูลจากตาราง users
    const users = await User.findAll({
      // 🔒 ความปลอดภัย: ไม่ดึงรหัสผ่านมาแสดง
      attributes: { exclude: ['password_hash'] }, 
      
      // 📅 เรียงลำดับ: เอาคนสมัครล่าสุดขึ้นก่อน
      order: [['created_at', 'DESC']] 
    });

    // ส่งข้อมูลกลับไปให้ Frontend
    res.status(200).json(users);

  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้', 
      error: error.message 
    });
  }
};

// (แถม) ฟังก์ชันดึงข้อมูลผู้ใช้รายคนตาม ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};