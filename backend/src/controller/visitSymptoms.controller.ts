// src/controller/visitSymptoms.controller.ts (เวอร์ชันแก้ไข)

import { Request, Response, NextFunction } from 'express';
import { VisitSymptomService } from '../services/visitSymptoms.service';

export const addVisitSymptoms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const visitId = parseInt(req.params.visit_id, 10);
    const symptomsData = req.body; 

    if (isNaN(visitId)) {
      return res.status(400).json({ message: 'Invalid Visit ID' });
    }

    //               👇 แก้ไขชื่อฟังก์ชันตรงนี้
    await VisitSymptomService.createOrUpdateVisitSymptoms(visitId, symptomsData);

    res.status(201).json({ message: 'Symptoms saved successfully' });
  } catch (error) {
    console.error('Error adding symptoms:', error);
    next(error);
  }
};