// backend/src/controller/visitDiagnosis.controller.ts
import { Request, Response } from 'express';
import * as visitDiagnosisService from '../services/visitDiagnosis.service';

// API: POST /visit-diagnoses
export const createVisitDiagnoses = async (req: Request, res: Response) => {
  try {
    // 🔥 แก้จุดที่ 1: รับ doctor_id จาก Body ด้วย (ที่ Frontend ส่งมา)
    const { visit_id, diagnoses, doctor_id } = req.body;
    
    // 🔥 แก้จุดที่ 2: ดึงจาก Token ให้ถูก key (userId ไม่มี underscore)
    // ลำดับ: เอาจาก Body ก่อน ถ้าไม่มีค่อยเอาจาก Token
    const finalDoctorId = doctor_id || (req as any).user?.userId; 

    // Debug ดูหน่อยว่าได้ค่ามาไหม (เดี๋ยวพี่จะเห็นเลข 7 หรือ 8 โผล่ใน Terminal)
    console.log(`👨‍⚕️ [DEBUG] Saving Diagnosis by Doctor ID: ${finalDoctorId}`);

    if (!visit_id || !diagnoses || !Array.isArray(diagnoses)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // ส่ง finalDoctorId ตัวที่ถูกต้องไปบันทึก
    const result = await visitDiagnosisService.addDiagnoses(visit_id, diagnoses, finalDoctorId);
    
    res.status(201).json({
      success: true,
      message: 'Diagnoses saved successfully',
      data: result
    });

  } catch (error: any) {
    console.error('Create Diagnosis Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// API: GET /visit-diagnoses/:visitId
export const getByVisitId = async (req: Request, res: Response) => {
  try {
    const visitId = parseInt(req.params.visitId);
    const result = await visitDiagnosisService.getDiagnosesByVisitId(visitId);
    
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};