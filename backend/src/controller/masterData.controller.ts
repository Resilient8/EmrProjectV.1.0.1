import { Request, Response, NextFunction } from 'express';

// Import Model ทั้งหมดที่เราจะใช้ในไฟล์นี้
import Symptom from '../models/symptom';
import Service from '../models/services';
import Procedure from '../models/procedure';
import Diagnosis from '../models/diagnosis';

// --- ฟังก์ชันสำหรับดึงข้อมูล "อาการ" ---
export const getAllSymptoms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const symptoms = await Symptom.findAll({ order: [['symptom_name', 'ASC']] });
    res.status(200).json(symptoms);
  } catch (error) {
    next(error);
  }
};

// --- ฟังก์ชันสำหรับดึงข้อมูล "บริการ" ---
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await Service.findAll({ order: [['service_name', 'ASC']] });
        res.status(200).json(services);
    } catch (error) {
        next(error);
    }
};

// --- ฟังก์ชันสำหรับดึงข้อมูล "หัตถการ" ---
export const getAllProcedures = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const procedures = await Procedure.findAll({ order: [['procedure_name', 'ASC']] });
        res.status(200).json(procedures);
    } catch (error) {
        next(error);
    }
};

// --- ฟังก์ชันสำหรับดึงข้อมูล "การวินิจฉัย" ---
export const getAllDiagnosis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const diagnosis = await Diagnosis.findAll({ order: [['diagnosis_name', 'ASC']] });
        res.status(200).json(diagnosis);
    } catch (error) {
        next(error);
    }
};