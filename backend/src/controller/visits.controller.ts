// 📂 backend/controllers/visits.controller.ts
import { Request, Response, NextFunction } from "express";
import db from '../db';
import { Op } from 'sequelize';

// Model Shortcuts
const { 
    VisitProcedure, Service, Procedure, Diagnosis, 
    Visit, VisitSymptom, Symptom, VitalSign, Patient,
    Prescription, Product, VisitDiagnosis, // ✅ Added VisitDiagnosis
    User // Added User for referencing
} = db;

// 🛑 Helper Function: Calculate Age
const calculateAge = (dobString: string | Date): number => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// 🔥 Helper Function: Gender
const getGenderFromPrefix = (prefix: string | null): string => {
    if (!prefix) return '-';
    const p = prefix.trim();
    if (['นาย', 'เด็กชาย', 'ด.ช.', 'Mr.', 'Master'].some(val => p.startsWith(val))) return 'ชาย';
    if (['นาง', 'นางสาว', 'น.s.', 'น.ส.', 'เด็กหญิง', 'ด.ญ.', 'Mrs.', 'Ms.', 'Miss'].some(val => p.startsWith(val))) return 'หญิง';
    return '-';
};

// ==========================================
// 1. Create New Visit
// ==========================================
export const createVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { patient_id, UserID, nurse_id, visit_datetime } = req.body;
        
        if (!patient_id || !visit_datetime) {
            return res.status(400).json({ message: 'Incomplete visit data provided.' });
        }

        // ✅ Handle Recorder ID (Nurse or Admin/User)
        const finalRecorderId = UserID || nurse_id;

        const createdVisit = await Visit.create({
            patient_id,
            UserID: finalRecorderId,      // Legacy field
            recorder_id: finalRecorderId, // 🔥 New: tracks who opened the case
            visit_datetime,
            status: 'รอตรวจ' // Default status
        });

        res.status(201).json({
            message: "Visit created successfully",
            visitId: createdVisit.getDataValue('visit_id')
        });
    } catch (error) {
        console.error("Error creating new visit:", error);
        next(error);
    }
};

// ==========================================
// 2. Delete Visit
// ==========================================
export const deleteVisitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) {
            return res.status(400).json({ message: 'Invalid Visit ID.' });
        }
        const affectedRows = await Visit.destroy({ where: { visit_id: visitId } });
        if (affectedRows === 0) {
            return res.status(404).json({ message: `Visit ID ${visitId} not found.` });
        }
        res.status(200).json({ message: `Visit ID ${visitId} was deleted.` });
    } catch (error) {
        console.error("Error deleting visit:", error);
        next(error);
    }
};

// ==========================================
// 3. Update Visit (Main Info + Vitals)
// ==========================================
export const updateVisitById = async (req: Request, res: Response, next: NextFunction) => {
    const visitId = parseInt(req.params.visit_id, 10);
    const allData = req.body;

    if (isNaN(visitId)) {
        return res.status(400).json({ message: 'Invalid Visit ID format' });
    }

    // 📝 Log 1: Start
    console.log(`📝 [UPDATE] Processing Visit ID: ${visitId}...`);

    const t = await db.sequelize.transaction();
    try {
        // 3.1 Update Main Visit Data
        const visitPayload = {
            chief_complaint: allData.chief_complaint,
            present_illness: allData.present_illness,
            plan: allData.plan, // 🔥 Plan Update
            diagnosis_note: allData.diagnosis_note,
            referral_department: allData.referral_department,
            referral_notes: allData.referral_notes,
            referral_doctor: allData.referral_doctor, 
            status: allData.status, 
            UserID: allData.nurse_id ? parseInt(allData.nurse_id, 10) : (allData.UserID ? parseInt(allData.UserID, 10) : undefined),
            recorder_id: allData.nurse_id ? parseInt(allData.nurse_id, 10) : (allData.UserID ? parseInt(allData.UserID, 10) : undefined)
        };

        // Filter out undefined values
        const filteredVisitPayload = Object.fromEntries(
            Object.entries(visitPayload).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(filteredVisitPayload).length > 0) {
            await Visit.update(filteredVisitPayload, {
                where: { visit_id: visitId },
                transaction: t
            });
        }

        // 3.2 Update Vital Signs
        const vitalKeys = [
            'temperature', 'pulse', 'respiration', 
            'blood_pressure_systolic', 'blood_pressure_diastolic', 
            'oxygen_saturation', 'height', 'weight', 'bmi', 'waist_circumference'
        ];
        const hasVitalData = vitalKeys.some(key => allData[key] !== undefined);

        if (hasVitalData) {
            const vitalSignPayload: any = {
                visit_id: visitId,
                temperature: allData.temperature,
                pulse: allData.pulse,
                respiration: allData.respiration,
                blood_pressure_systolic: allData.blood_pressure_systolic,
                blood_pressure_diastolic: allData.blood_pressure_diastolic,
                oxygen_saturation: allData.oxygen_saturation,
                height: allData.height,
                weight: allData.weight,
                bmi: allData.bmi,
                waist_circumference: allData.waist_circumference,
                recorded_by: allData.nurse_id ? parseInt(allData.nurse_id, 10) : (allData.UserID ? parseInt(allData.UserID, 10) : undefined)
            };

            const existingVital = await VitalSign.findOne({ where: { visit_id: visitId }, transaction: t });
            if (existingVital) {
                await existingVital.update(vitalSignPayload, { transaction: t });
            } else {
                await VitalSign.create(vitalSignPayload, { transaction: t });
            }
        }

        await t.commit();

        // ✅ Log 2: Success
        console.log(`✅ [UPDATE] Success! Visit: ${visitId} | Status: ${visitPayload.status || 'No Change'} | Doc: ${visitPayload.referral_doctor || 'None'}`);

        res.status(200).json({ message: `Visit ID ${visitId} updated successfully.` });

    } catch (error) {
        await t.rollback();
        console.error("❌ [UPDATE ERROR]", error); 
        next(error);
    }
};

// ==========================================
// 4. Get Visit Details (Full Join)
// ==========================================
export const getVisitDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) return res.status(400).json({ message: "Invalid Visit ID" });

        // 1. Fetch Main Visit Data
        const visitData = await Visit.findOne({
            where: { visit_id: visitId },
            include: [
                { model: Patient, as: 'Patient' },
                { model: VitalSign, as: 'vitalSign' },
                {
                    model: VisitSymptom,
                    as: 'symptoms',
                    include: [{ model: Symptom, as: 'symptom', attributes: ['symptom_name'] }]
                },
                // 🔥 New: VisitDiagnosis from ICD10
                { 
                    model: VisitDiagnosis, 
                    as: 'icd10_diagnoses',
                    include: ['icd10_detail'] 
                }
            ]
        });

        if (!visitData) return res.status(404).json({ message: 'Visit not found' });

        // 2. Fetch Procedures (Legacy Diagnoses + Services + Procedures)
        const rawProceduresData = await VisitProcedure.findAll({
            where: { visit_id: visitId },
            include: [
                { model: Service, as: 'service', attributes: ['service_name'] },
                { model: Procedure, as: 'procedure', attributes: ['procedure_name'] },
                { model: Diagnosis, as: 'diagnosis', attributes: ['diagnosis_name'] } 
            ]
        });

        // 3. Fetch Prescriptions
        const prescriptionsData = await Prescription.findAll({
            where: { visit_id: visitId },
            include: [
                { model: Product, as: 'product', attributes: ['product_name'] }
            ]
        });

        // 4. Prepare Patient Info
        let avatarUrl = null;
        if (visitData.Patient.avatar_url) {
            const cleanPath = visitData.Patient.avatar_url.replace(/\\/g, '/');
            avatarUrl = cleanPath.startsWith('http') 
                ? cleanPath 
                : `http://localhost:3000${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
        }

        const patientInfoPayload = {
            ...visitData.Patient.get(),
            name: `${visitData.Patient.prefix || ''} ${visitData.Patient.first_name} ${visitData.Patient.last_name}`.trim(),
            age: calculateAge(visitData.Patient.birth_date), 
            hn: visitData.Patient.patient_id_string,
            patientId: visitData.Patient.patient_id,
            gender: getGenderFromPrefix(visitData.Patient.prefix),
            bloodGroup: visitData.Patient.blood_group,
            allergies: visitData.Patient.drug_allergies,
            foodAllergies: visitData.Patient.food_allergies,
            underlyingDisease: visitData.Patient.underlying_disease,
            avatarUrl: avatarUrl
        };

        // 5. Map Diagnoses (Merge Old & New)
        
        // A. Old (VisitProcedure)
        const oldDiagnoses = rawProceduresData
            .filter((p: any) => p.diagnosis)
            .map((p: any) => ({ 
                name: p.diagnosis.diagnosis_name, 
                code: '', 
                source: 'old'
            }));

        // B. New (VisitDiagnosis + ICD10)
        const newDiagnoses = (visitData.icd10_diagnoses || []).map((vd: any) => {
            let diagName = vd.icd10_detail?.name_th || vd.icd10_detail?.name_en || vd.icd10_code;
            if (vd.icd10_code) diagName = `${vd.icd10_code} : ${diagName}`;

            return {
                name: diagName,
                diagnosis_name: diagName,
                diagnosis_code: vd.icd10_code,
                code: vd.icd10_code,
                icd10_code: vd.icd10_code,
                source: 'new'
            };
        });

        // C. Combine
        const combinedDiagnoses = [...newDiagnoses, ...oldDiagnoses];

        const services = rawProceduresData
            .filter((p: any) => p.service)
            .map((p: any) => ({ name: p.service.service_name }));

        const procedures = rawProceduresData
            .filter((p: any) => p.procedure)
            .map((p: any) => ({ name: p.procedure.procedure_name }));

        const prescriptionsList = prescriptionsData.map((p: any) => ({
            id: p.id,
            name: p.product?.product_name || p.drug_name || 'ไม่ระบุชื่อยา',
            quantity: p.quantity,
            dosage: p.dosage,
            instruction: p.instruction
        }));

        res.json({
            visit: {
                ...visitData.get(),
                plan: visitData.plan, 
                diagnosis_note: visitData.diagnosis_note, 
                referral_notes: visitData.referral_notes
            },
            patientInfo: patientInfoPayload,
            vitalSigns: visitData.vitalSign || {},
            diagnoses: combinedDiagnoses, 
            services: services,
            procedures: procedures,
            prescriptions: prescriptionsList,
            symptoms: {
                chiefComplaints: visitData.symptoms?.map((vs: any) => ({
                    name: vs.symptom?.symptom_name,
                    duration: vs.duration,
                    level: vs.level,
                    locations: vs.locations
                })) || [],
                PresentIllness: visitData.present_illness,
                reviewOfSystems: {
                    general: visitData.getDataValue('ros_general') || visitData['ros_general'],
                    headAndNeck: visitData.getDataValue('ros_head_and_neck') || visitData['ros_head_and_neck'],
                    respiratory: visitData.getDataValue('ros_respiratory') || visitData['ros_respiratory'],
                    cardiovascular: visitData.getDataValue('ros_cardiovascular') || visitData['ros_cardiovascular'],
                    gastrointestinal: visitData.getDataValue('ros_gastrointestinal') || visitData['ros_gastrointestinal'],
                    skin: visitData.getDataValue('ros_skin') || visitData['ros_skin']
                }
            }
        });

    } catch (error) {
        console.error("Error fetching visit details:", error);
        next(error);
    }
};

// ==========================================
// 5. Basic Getters
// ==========================================
export const getVisitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) return res.status(400).json({ message: "Invalid Visit ID" });

        const visit = await Visit.findByPk(visitId, {
            include: [
                { model: Patient, as: 'Patient' },
                { model: VitalSign, as: 'vitalSign' }
            ]
        });

        if (visit) res.json(visit);
        else res.status(404).json({ message: 'Visit not found' });
    } catch (error) {
        next(error);
    }
};

export const getAllVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allVisits = await Visit.findAll({
            include: [{ model: VitalSign, as: 'vitalSign' }],
            order: [['visit_datetime', 'DESC']]
        });
        res.json(allVisits);
    } catch (error) { next(error); }
};

export const getVisitsByPatientId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patientId = req.params.patientId;
        const visits = await Visit.findAll({
            where: { patient_id: patientId },
            include: [{ model: VitalSign, as: 'vitalSign' }],
            order: [['visit_datetime', 'DESC']]
        });
        res.json(visits);
    } catch (error) { next(error); }
};

// ==========================================
// 6. Update Procedures (Legacy Support + Services/Procedures)
// ==========================================
export const updateVisitProcedures = async (req: Request, res: Response, next: NextFunction) => {
    const t = await db.sequelize.transaction();
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        
        // 🔥 Handle various ID formats
        const { diagnoses, services, procedures, userId, doctor_id, nurse_id } = req.body;
        const currentUserId = doctor_id || nurse_id || userId; 

        if (isNaN(visitId)) {
            await t.rollback();
            return res.status(400).json({ message: 'Invalid Visit ID' });
        }

        // Wipe old procedures/services/legacy diagnoses for this visit
        await VisitProcedure.destroy({ where: { visit_id: visitId }, transaction: t });

        // 1. Diagnoses (Legacy / Free Text)
        if (diagnoses && diagnoses.length > 0) {
            for (const item of diagnoses) {
                const [diagObj] = await Diagnosis.findOrCreate({
                    where: { diagnosis_name: item.name },
                    defaults: { 
                        diagnosis_name: item.name,
                        doctor_id: currentUserId 
                    },
                    transaction: t
                });

                await VisitProcedure.create({
                    visit_id: visitId,
                    diagnosis_id: diagObj.id,
                    recorded_by: currentUserId 
                }, { transaction: t });
            }
        }

        // 2. Services
        if (services && services.length > 0) {
            for (const item of services) {
                const [servObj] = await Service.findOrCreate({
                    where: { service_name: item.name },
                    defaults: { service_name: item.name },
                    transaction: t
                });
                await VisitProcedure.create({
                    visit_id: visitId,
                    service_id: servObj.id,
                    recorded_by: currentUserId 
                }, { transaction: t });
            }
        }

        // 3. Procedures
        if (procedures && procedures.length > 0) {
            for (const item of procedures) {
                const [procObj] = await Procedure.findOrCreate({
                    where: { procedure_name: item.name },
                    defaults: { procedure_name: item.name },
                    transaction: t
                });
                await VisitProcedure.create({
                    visit_id: visitId,
                    procedure_id: procObj.procedure_id || procObj.id,
                    recorded_by: currentUserId 
                }, { transaction: t });
            }
        }

        await t.commit();
        res.status(200).json({ message: 'Medical records updated successfully' });

    } catch (error) {
        await t.rollback();
        console.error("Error updating procedures:", error);
        next(error);
    }
};

// ==========================================
// 7. Update Symptoms
// ==========================================
export const updateVisitSymptoms = async (req: Request, res: Response, next: NextFunction) => {
    const t = await db.sequelize.transaction();
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        
        // 🔥 Handle Nurse/User ID
        const recorderId = req.body.nurse_id || req.body.UserID;

        let symptomsData = req.body; 
        if (!Array.isArray(symptomsData) && symptomsData.symptoms) symptomsData = symptomsData.symptoms;
        if (!Array.isArray(symptomsData)) symptomsData = Array.isArray(symptomsData) ? symptomsData : (symptomsData ? [symptomsData] : []);

        if (isNaN(visitId)) {
             await t.rollback();
             return res.status(400).json({ message: 'Invalid Visit ID' });
        }

        // Clear old symptoms
        await VisitSymptom.destroy({ where: { visit_id: visitId }, transaction: t });

        const newRecords = [];
        let presentIllnessUpdate = null;
        let rosUpdate: any = {};

        for (const item of symptomsData) {
            // Check for PI / ROS fields
            if (item.PresentIllness !== undefined || item.ROS_General !== undefined) {
                if(item.PresentIllness !== undefined) presentIllnessUpdate = item.PresentIllness;
                if(item.ROS_General !== undefined) rosUpdate.ros_general = item.ROS_General;
                if(item.ROS_HeadAndNeck !== undefined) rosUpdate.ros_head_and_neck = item.ROS_HeadAndNeck;
                if(item.ROS_Respiratory !== undefined) rosUpdate.ros_respiratory = item.ROS_Respiratory;
                if(item.ROS_Cardiovascular !== undefined) rosUpdate.ros_cardiovascular = item.ROS_Cardiovascular;
                if(item.ROS_Gastrointestinal !== undefined) rosUpdate.ros_gastrointestinal = item.ROS_Gastrointestinal;
                if(item.ROS_Skin !== undefined) rosUpdate.ros_skin = item.ROS_Skin;
                continue;
            }

            // Chief Complaints
            if (item.ChiefComplaint) {
                let symptomId = null;
                const symObj = await Symptom.findOne({ where: { symptom_name: item.ChiefComplaint }, transaction: t });
                
                if (symObj) {
                    symptomId = symObj.id || symObj.symptom_id || symObj.getDataValue('id');
                } else {
                    const newSym = await Symptom.create({ symptom_name: item.ChiefComplaint }, { transaction: t });
                    symptomId = newSym.id || newSym.symptom_id || newSym.getDataValue('id');
                }

                if (symptomId) {
                    newRecords.push({
                        visit_id: visitId,
                        symptom_id: symptomId,
                        duration: item.duration,
                        level: item.level,
                        locations: item.locations,
                        recorded_by: recorderId 
                    });
                }
            }
        }

        // Bulk insert symptoms
        if (newRecords.length > 0) {
            await VisitSymptom.bulkCreate(newRecords, { transaction: t });
        }

        // Update Visit Table (PI, ROS, Recorder)
        const updatePayload: any = {};
        
        if (recorderId) {
            updatePayload.recorder_id = recorderId;
        }

        if (presentIllnessUpdate !== null) {
            updatePayload.present_illness = presentIllnessUpdate; 
        }
        
        if (Object.keys(rosUpdate).length > 0) {
             Object.assign(updatePayload, rosUpdate);
        }

        if (Object.keys(updatePayload).length > 0) {
            await Visit.update(updatePayload, { where: { visit_id: visitId }, transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: 'Symptoms updated successfully' });

    } catch (error) {
        await t.rollback();
        console.error("Error updating symptoms:", error);
        next(error);
    }
};