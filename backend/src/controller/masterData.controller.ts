// สร้าง/แก้ไขไฟล์ที่: src/controller/masterData.controller.ts

import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db'; // <-- เพิ่มบรรทัดนี้เข้าไป

export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Services');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getAllProcedures = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Procedures');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getAllDiagnosis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Diagnosis');
        res.json(rows);
    } catch (error) {
        next(error);
    }
};
