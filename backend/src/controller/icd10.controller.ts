import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ICD10 from '../models/icd10'; // ตรวจสอบ path ให้ถูกกับไฟล์ model ที่สร้าง

export const getICD10List = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    let whereClause = {};
    
    // ถ้ามีการพิมพ์ค้นหา (search query)
    if (search) {
      whereClause = {
        [Op.or]: [
          { code: { [Op.like]: `%${search}%` } },      // ค้นจากรหัส (เช่น J00)
          { name_th: { [Op.like]: `%${search}%` } },   // ค้นจากชื่อไทย
          { name_en: { [Op.like]: `%${search}%` } }    // ค้นจากชื่ออังกฤษ
        ],
        is_active: true
      };
    } else {
        // ถ้าไม่ค้นหา เอามาเฉพาะที่ active (อาจจะ limit ไว้หน่อยกันเยอะเกิน)
        whereClause = { is_active: true };
    }

    const diseases = await ICD10.findAll({
      where: whereClause,
      limit: 100, // ดึงมาแค่ 20 ตัวพอ กันหน่วงตอนพิมพ์
      order: [['code', 'ASC']]
    });

    res.status(200).json(diseases);
  } catch (error) {
    console.error('Error fetching ICD10:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};