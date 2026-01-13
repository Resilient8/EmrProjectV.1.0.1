import { Request, Response } from 'express';
import db from '../db';
import { Op } from 'sequelize';

const { Medication } = db;

// 1. getAllMedications: ดึงรายชื่อยา + สต็อก
export const getAllMedications = async (req: Request, res: Response) => {
    try {
        const meds = await Medication.findAll({
            order: [['generic_name', 'ASC']]
        });
        res.status(200).json(meds);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching medications", error: error.message });
    }
};

// 2. createMedication: เพิ่มยาใหม่
export const createMedication = async (req: Request, res: Response) => {
    try {
        const newMed = await Medication.create(req.body);
        res.status(201).json(newMed);
    } catch (error: any) {
        res.status(500).json({ message: "Error creating medication", error: error.message });
    }
};

// 3. updateMedication: แก้ไขข้อมูลยา
export const updateMedication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Medication.update(req.body, { where: { id } });
        res.json({ message: 'Updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: "Error updating medication", error: error.message });
    }
};

// 4. deleteMedication: ลบยา
export const deleteMedication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Medication.destroy({ where: { id } });
        res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting medication", error: error.message });
    }
};

// 5. [⭐ เพิ่มใหม่] restockMedication: เติมสต็อก
export const restockMedication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount } = req.body; // จำนวนที่รับเข้าเพิ่ม

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // ใช้ increment เพื่อบวกเพิ่มจากเดิม (ปลอดภัยกว่าดึงมาบวกเอง)
        await Medication.increment('stock_quantity', { 
            by: parseInt(amount),
            where: { id }
        });

        res.json({ message: 'Restock successfully' });
    } catch (error: any) {
        res.status(500).json({ message: "Error restocking", error: error.message });
    }
};