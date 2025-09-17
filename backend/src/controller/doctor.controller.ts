import { Request, Response } from 'express';
// --- 1. แก้ไขการ Import ---
import db from '../db'; 
const { Doctor, User, Department } = db; // Import Models ที่จำเป็นทั้งหมด

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    // --- 2. แก้ไข Query ---
    // ค้นหาจาก Model `Doctor` โดยตรง และใช้ include เพื่อดึงข้อมูลที่เกี่ยวข้อง
    const doctors = await Doctor.findAll({
      include: [
        {
          model: User,
          attributes: ['prefix', 'first_name', 'last_name'] // เลือกเฉพาะข้อมูลที่จำเป็น
        },
        {
          model: Department,
          attributes: ['name']
        }
      ],
      order: [
        [User, 'first_name', 'ASC'] // เรียงตามชื่อแพทย์
      ]
    });

    // --- 3. แก้ไขการจัดรูปแบบข้อมูล ---
    // แปลงข้อมูลให้เป็น Format ที่ Frontend ต้องการ
    const formattedDoctors = doctors.map(doc => {
      // ตรวจสอบข้อมูลก่อนใช้งานเพื่อความปลอดภัย
      const user = doc.User || {};
      const department = doc.Department || {};

      return {
        id: doc.user_id,
        name: `${user.prefix || ''} ${user.first_name || ''} ${user.last_name || ''}`.trim(),
        department: department.name || 'N/A'
      };
    });

    res.status(200).json(formattedDoctors);
  } catch (error: any) {
    console.error("Error fetching doctors:", error); // Log error ที่ละเอียดขึ้น
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};