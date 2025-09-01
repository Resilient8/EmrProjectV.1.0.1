// src/controller/visits.controller.ts

import { Request, Response, NextFunction } from 'express';
import { VisitService } from '../services/visits.service';
import { VisitSymptomService } from '../services/visitSymptoms.service';

// ====================================================================
// ฟังก์ชันสำหรับ "Visit หลัก" (Vitals, Referral)
// ====================================================================

export const createVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitData = req.body;
        if (!visitData.visit_datetime) {
            visitData.visit_datetime = new Date();
        }
        const newVisitId = await VisitService.createVisit(visitData);
        res.status(201).json({ message: 'Visit created successfully', visitId: newVisitId });
    } catch (error) {
        next(error);
    }
};

export const getVisitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const visit = await VisitService.getVisitById(visitId);
        if (visit) {
            res.json(visit);
        } else {
            res.status(404).json({ message: 'Visit not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const updateVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const fieldsToUpdate = req.body;
        if (!visitId || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: "Visit ID or fields to update are missing" });
        }
        const success = await VisitService.updateVisit(visitId, fieldsToUpdate);
        if (success) {
            res.status(200).json({ message: `Visit ID ${visitId} updated successfully.` });
        } else {
            res.status(404).json({ message: `Visit with ID ${visitId} not found.` });
        }
    } catch (error) {
        next(error);
    }
};

// ====================================================================
// ฟังก์ชันสำหรับ "อาการ" (Symptoms)
// ====================================================================

export const getVisitSymptoms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const symptoms = await VisitSymptomService.getSymptomsByVisitId(visitId);

        if (symptoms) {
            const parseJsonField = (field: any) => {
                try { return (typeof field === 'string') ? JSON.parse(field) : (field || []); } catch { return []; }
            };
            const responseData = {
                ChiefComplaint: symptoms.ChiefComplaint,
                PresentIllness: symptoms.PresentIllness,
                ROS_General: parseJsonField(symptoms.ROS_General),
                ROS_HeadAndNeck: parseJsonField(symptoms.ROS_HeadAndNeck),
                ROS_Respiratory: parseJsonField(symptoms.ROS_Respiratory),
                ROS_Cardiovascular: parseJsonField(symptoms.ROS_Cardiovascular),
                ROS_Gastrointestinal: parseJsonField(symptoms.ROS_Gastrointestinal),
                ROS_Skin: parseJsonField(symptoms.ROS_Skin),
            };
            res.json(responseData);
        } else {
            res.json({ ChiefComplaint: '', PresentIllness: '', ROS_General: [], ROS_HeadAndNeck: [], ROS_Respiratory: [], ROS_Cardiovascular: [], ROS_Gastrointestinal: [], ROS_Skin: [] });
        }
    } catch (error) {
        next(error);
    }
};

// ====================================================================
// ฟังก์ชันอื่นๆ
// ====================================================================

export const getAllVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rows = await VisitService.getAllVisits();
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getVisitsByPatientId = async (req: Request, res: Response, next: NextFunction) => {
    const { patientId } = req.params;
    try {
        const rows = await VisitService.getVisitsByPatientId(patientId);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// --- Export ทั้งหมด ---
export default {
    createVisit,
    getAllVisits,
    getVisitById,
    updateVisit,
    getVisitsByPatientId,
    getVisitSymptoms,
};
