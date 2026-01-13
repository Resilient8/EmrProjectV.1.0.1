import { Request, Response, NextFunction } from "express";
import db from '../db';
import { Op } from 'sequelize'; // ✅ จำเป็นต้องมีเพื่อใช้คำสั่ง Like (ค้นหา)

// --- ดึงทั้งหมด "อาการ" ---
export const getAllSymptoms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const symptoms = await db.Symptom.findAll({ order: [['symptom_name', 'ASC']] });
        res.status(200).json(symptoms);
    } catch (error) {
        console.error("Error fetching symptoms:", error);
        next(error);
    }
};

// --- ดึงทั้งหมด "บริการ" ---
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await db.Service.findAll({ order: [['service_name', 'ASC']] });
        res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        next(error);
    }
};

// --- ดึงทั้งหมด "หัตถการ" ---
export const getAllProcedures = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await db.Procedure.findAll({ order: [['procedure_name', 'ASC']] });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching procedures:", error);
        next(error);
    }
};

// --- ดึงทั้งหมด "การวินิจฉัย" (เปลี่ยนไปใช้ ICD-10) ---
export const getAllDiagnosis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // รับค่าคำค้นหาจาก Frontend (เช่น ?search=J00)
        const { search } = req.query;

        let whereClause = {};

        // ถ้ามีคำค้นหา ให้หาจาก รหัส, ชื่อไทย, หรือชื่ออังกฤษ
        if (search) {
            whereClause = {
                [Op.or]: [
                    { code: { [Op.like]: `%${search}%` } },
                    { name_th: { [Op.like]: `%${search}%` } },
                    { name_en: { [Op.like]: `%${search}%` } }
                ]
            };
        } else {
             // ถ้าไม่ค้นหา ให้ดึงเฉพาะที่ active
             whereClause = { is_active: true };
        }

        // 🔥 ดึงจากตาราง ICD10 แทนตารางเก่า
        // จำกัดแค่ 50-100 ตัว เพื่อป้องกันเว็บค้าง (เพราะ ICD10 มี 30,000+ รายการ)
        const icd10Items = await db.ICD10.findAll({
            where: whereClause,
            limit: 500, 
            order: [['code', 'ASC']]
        });

        // แปลงร่างข้อมูล (Map) ให้ Frontend ใช้งานได้ทันทีโดยไม่ต้องแก้ Frontend
        const formattedData = icd10Items.map((item: any) => ({
            id: item.code, // ใช้รหัสโรคเป็น ID
            code: item.code,
            // รวมชื่อให้ Dropdown แสดงผลสวยๆ: "J00: โรคหวัด"
            name: `${item.code}: ${item.name_th}`, 
            diagnosis_name: `${item.code}: ${item.name_th}`, // เผื่อ Frontend ใช้ field นี้
            name_en: item.name_en
        }));

        res.status(200).json(formattedData);

    } catch (error) {
        console.error("Error fetching diagnosis (ICD-10):", error);
        // ถ้าเกิด Error (เช่นยังไม่ได้สร้างตาราง ICD10) ให้โยน error ไป
        next(error);
    }
};

// --- ดึงทั้งหมด "ยา" ---
export const getAllMedications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // รองรับการค้นหายาด้วย (เผื่ออนาคตยาเยอะ)
        const { search } = req.query;
        let whereClause: any = { is_active: true };

        if (search) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { generic_name: { [Op.like]: `%${search}%` } },
                    { trade_name: { [Op.like]: `%${search}%` } },
                    { medication_code: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const items = await db.Medication.findAll({
            where: whereClause,
            limit: 100, // กันเหนียว
            order: [['generic_name', 'ASC']]
        });

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching medications:", error);
        next(error);
    }
};