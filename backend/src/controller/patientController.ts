import { Request, Response, NextFunction } from "express";
import db from '../db';
import { Op } from "sequelize";

// 🔥 Fix 1: Import Models ให้ครบถ้วน
const { 
  Patient, Visit, VisitSymptom, VisitProcedure, 
  Service, Procedure, Diagnosis, VitalSign, Symptom,
  Prescription, Product, VisitDiagnosis, ICD10 
} = db;

// 🔥 Helper Function: แปลงคำนำหน้าเป็นเพศ
const getGenderFromPrefix = (prefix: string | null): string => {
    if (!prefix) return '-';
    const p = prefix.trim();
    if (['นาย', 'เด็กชาย', 'ด.ช.', 'Mr.', 'Master'].some(val => p.startsWith(val))) return 'ชาย';
    if (['นาง', 'นางสาว', 'น.s.', 'น.ส.', 'เด็กหญิง', 'ด.ญ.', 'Mrs.', 'Ms.', 'Miss'].some(val => p.startsWith(val))) return 'หญิง';
    return '-'; 
};

// --- Get All Patients ---
export const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await Patient.findAll();
    const formattedPatients = patients.map((p: any) => {
        const json = p.toJSON();
        return {
            ...json,
            gender: getGenderFromPrefix(json.prefix)
        };
    });

    res.status(200).json({
      message: "OK",
      result: formattedPatients,
    });
  } catch (err) {
    next(err);
  }
};

// --- Get Patient by ID ---
export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    const json = patient.toJSON();
    const result = {
        ...json,
        gender: getGenderFromPrefix(json.prefix)
    };

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// --- Delete Patient by ID ---
export const deletePatientById = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const affectedRows = await Patient.destroy({ where: { id: id } });
    if (affectedRows === 0) {
        return res.status(404).json({ message: "Patient not found for deletion" });
    }
    res.status(200).json({
      message: "OK",
      result: `Patient with ID ${id} has been deleted`,
    });
  } catch (err) {
    next(err);
  }
};

// --- Create New Patient ---
export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPatientData = req.body;

    if (req.file) {
      newPatientData.avatar_url = `/uploads/${req.file.filename}`;
    }

    if (!newPatientData.first_name || !newPatientData.last_name) {
      return res.status(400).json({ message: "Invalid data (First name and Last name required)" });
    }

    const createdPatient = await Patient.create(newPatientData);
    res.status(201).json({ message: "Patient created successfully", result: createdPatient });
  } catch (err) {
    next(err);
  }
};

// --- Update Patient Info ---
export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const updatedPatientData = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    const [affectedRows] = await Patient.update(updatedPatientData, { where: { id: id } });
    if (affectedRows === 0) {
        return res.status(404).json({ message: "Patient not found for update" });
    }
    res.status(200).json({ message: `Patient with ID ${id} updated successfully` });
  } catch (err) {
    next(err);
  }
};

// --- Update Patient Avatar ---
export const updatePatientAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const [affectedRows] = await Patient.update(
      { avatar_url: avatarUrl }, 
      { where: { id: id } }
    );

    if (affectedRows === 0) {
       return res.status(404).json({ message: "Patient not found for avatar update" });
    }

    res.status(200).json({
      message: "Avatar updated successfully",
      avatarUrl: avatarUrl 
    });

  } catch (error) {
    console.error("Error updating avatar:", error);
    next(error);
  }
};

// --- Update Patient Status ---
export const updatePatientStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (isNaN(patientId) || !status) {
      return res.status(400).json({ message: 'Invalid patient ID or status provided.' });
    }
    const [affectedRows] = await Patient.update({ status: status }, { where: { id: patientId } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: `Patient with ID ${patientId} not found.` });
    }
    res.status(200).json({ message: `Patient ${patientId} status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

// --- Get Patient Registry (Dashboard) ---
export const getPatientRegistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientsWithVisits = await Patient.findAll({
      include: [{
        model: Visit,
        as: 'visits',
        required: false, 
        attributes: [ 'visit_id', 'patient_id', 'visit_datetime', 'notes', 'UserID', 'status' ],
        include: [{
            model: VitalSign,
            as: 'vitalSign',
            required: false,
            attributes: ['temperature', 'pulse']
        }]
      }],
      order: [
        ['id', 'DESC'], 
        [{ model: Visit, as: 'visits' }, 'visit_datetime', 'DESC']
      ]
    });

    const processedPatients = patientsWithVisits.map((patient: any) => {
      const patientJSON = patient.toJSON();
      const gender = getGenderFromPrefix(patientJSON.prefix);
      let dailyCounter = 0;
      let lastDate = '';

      const rawVisits = patientJSON.visits || [];

      const visitsWithDailyNumber = rawVisits.map((visit: any) => {
        const visitDate = new Date(visit.visit_datetime).toISOString().slice(0, 10);
        if (visitDate !== lastDate) {
          dailyCounter = 1;
          lastDate = visitDate;
        } else {
          dailyCounter++;
        }
        return { ...visit, daily_visit_number: dailyCounter };
      });
      
      visitsWithDailyNumber.sort((a: any, b: any) => new Date(b.visit_datetime).getTime() - new Date(a.visit_datetime).getTime());

      return { 
          ...patientJSON, 
          gender: gender, 
          bloodGroup: patientJSON.blood_group, 
          visits: visitsWithDailyNumber 
      };
    });

    res.status(200).json(processedPatients);

  } catch (error) {
    console.error("🔥🔥 Error executing getPatientRegistry:", error);
    next(error);
  }
};

// --- 🔥 Get Detailed Patient Record (History) ---
export const getPatientRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientPrimaryKey = parseInt(req.params.id, 10);
    if (isNaN(patientPrimaryKey)) {
      return res.status(400).json({ message: 'Invalid Patient ID' });
    }

    const patientWithRecord = await Patient.findByPk(patientPrimaryKey, {
      include: [
        {
          model: Visit,
          as: 'visits',
          order: [['visit_datetime', 'DESC']],
          include: [
            // 1. Vital Signs
            {
              model: VitalSign,
              as: 'vitalSign',
              attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'visit_id'] }
            },
            // 2. Symptoms
            {
              model: VisitSymptom,
              as: 'symptoms',
              attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'visit_id'] },
              include: [
                {
                   model: Symptom,
                   as: 'symptom', 
                   attributes: ['symptom_name']
                }
              ]
            },
            // 3. Procedures
            {
              model: VisitProcedure,
              as: 'visitProcedures',
              attributes: ['notes'],
              include: [
                { model: Service, as: 'service', attributes: ['service_name'] },
                { model: Procedure, as: 'procedure', attributes: ['procedure_name'] },
                { model: Diagnosis, as: 'diagnosis', attributes: ['diagnosis_name'] }
              ]
            },
            // 4. Prescriptions
            {
               model: Prescription,
               as: 'prescriptions',
               include: [
                  { 
                     model: Product, 
                     as: 'product',
                     attributes: ['product_name'] 
                  }
               ]
            },
            // 🔥🔥🔥 5. Visit Diagnoses (ICD-10) 🔥🔥🔥
            {
               model: VisitDiagnosis,
               as: 'icd10_diagnoses', // ชื่อเล่นตรงกับ db/index.ts
               required: false,
               include: [
                 {
                   model: ICD10,
                   as: 'icd10_detail', // ชื่อเล่นตรงกับ db/index.ts
                   required: false,
                   // ✅ แก้แล้ว: ใช้ชื่อฟิลด์จริงใน DB (name_th, name_en)
                   attributes: ['code', 'name_th', 'name_en'] 
                 }
               ]
            }
          ]
        }
      ]
    });

    if (!patientWithRecord) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patientJSON = patientWithRecord.toJSON();
    
    patientJSON.gender = getGenderFromPrefix(patientJSON.prefix);
    patientJSON.bloodGroup = patientJSON.blood_group;

    const visits = patientJSON.visits || [];
    delete patientJSON.visits;

    res.status(200).json({
      patient: patientJSON,
      visits: visits
    });

  } catch (error) {
    console.error('Error fetching patient record by ID:', error);
    next(error);
  }
};