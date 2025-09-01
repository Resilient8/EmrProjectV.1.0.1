import { Request, Response } from 'express';
import { VisitProcedureService } from '../services/visitProcedure.service';
import { IProcedureInput } from '../models/visitProcedures';

/**
 * Controller function to handle adding multiple procedures to a visit.
 * (ฟังก์ชันบันทึกข้อมูลเดิมของคุณ - ถูกต้องแล้ว)
 */
export const addOrUpdateVisitProcedures = async (req: Request, res: Response) => {
  try {
    // 1. ดึง visit_id จาก URL parameter
    const visitId = parseInt(req.params.visit_id, 10);

    // 2. ดึง "รายการการรักษา" (Array) จาก request body
    const procedures: IProcedureInput[] = req.body;

    // ตรวจสอบว่าข้อมูลที่ได้มาถูกต้องหรือไม่
    if (isNaN(visitId) || !Array.isArray(procedures)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // 3. เรียกใช้ Service เพื่อบันทึกข้อมูล
    await VisitProcedureService.createMultipleProcedures(visitId, procedures);

    // 4. ส่งคำตอบกลับไปว่าทำสำเร็จแล้ว
    res.status(201).json({ message: 'Procedures saved successfully' });

  } catch (error) {
    console.error('Error in addOrUpdateVisitProcedures controller:', error);
    res.status(500).json({ message: 'Server error while saving procedures' });
  }
};


// =================================================================================
// ===== START: ADDED CODE BLOCK / เพิ่มฟังก์ชันใหม่ตรงนี้ =====
// =================================================================================
/**
 * Controller function to get all procedures for a specific visit.
 * (ฟังก์ชันสำหรับดึงข้อมูลการรักษา - เพิ่มใหม่)
 */
export const getVisitProcedures = async (req: Request, res: Response) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) {
            return res.status(400).json({ message: 'Invalid visit ID' });
        }

        // --- เรียกใช้ฟังก์ชันใหม่จาก Service ที่เราสร้างไว้ ---
        const procedures = await VisitProcedureService.getProceduresWithNamesByVisitId(visitId);

        // ส่งข้อมูลที่ได้ (พร้อมชื่อ) กลับไปให้ Frontend
        res.status(200).json(procedures);

    } catch (error) {
        console.error('Error in getVisitProcedures controller:', error);
        res.status(500).json({ message: 'Server error while fetching procedures' });
    }
};
// =================================================================================
// ===== END: ADDED CODE BLOCK / สิ้นสุดส่วนที่เพิ่ม =====
// =================================================================================
