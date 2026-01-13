// 📂 backend/controllers/visits.controller.ts
import { Request, Response, NextFunction } from "express";
import db from '../db';
import { Op } from 'sequelize';

// Model Shortcuts
const { 
    VisitProcedure, Service, Procedure, Diagnosis, 
    Visit, VisitSymptom, Symptom, VitalSign, Patient,
    Prescription, Product 
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
// 1. Create New Visit (เพิ่มการรองรับ nurse_id)
// ==========================================
export const createVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { patient_id, UserID, nurse_id, visit_datetime } = req.body;
        
        if (!patient_id || !visit_datetime) {
            return res.status(400).json({ message: 'Incomplete visit data provided.' });
        }

        // ✅ รวม ID คนบันทึก (พยาบาล/เจ้าหน้าที่)
        const finalRecorderId = UserID || nurse_id;

        const createdVisit = await Visit.create({
            patient_id,
            UserID: finalRecorderId,      // ของเดิม
            recorder_id: finalRecorderId, // 🔥 เพิ่มใหม่: บันทึกคนเปิดเคส
            visit_datetime,
            status: 'รอตรวจ'
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


// ... imports เหมือนเดิม

// ==========================================
// 3. Update Visit (ฉบับแก้ไขให้ตรง Model Visit.ts เป๊ะๆ)
// ==========================================
export const updateVisitById = async (req: Request, res: Response, next: NextFunction) => {
    const visitId = parseInt(req.params.visit_id, 10);
    const allData = req.body;

    if (isNaN(visitId)) {
        return res.status(400).json({ message: 'Invalid Visit ID format' });
    }

    console.log(`\n=========================================`);
    console.log(`🔍 [DEBUG] Start Updating Visit ID: ${visitId}`);
    console.log(`📥 [DEBUG] Received Body:`, JSON.stringify(allData, null, 2));

    const t = await db.sequelize.transaction();
    try {
        // 3.1 Update Main Visit Data
        // 🔥 รวมฟิลด์เดิมที่คุณมี และเพิ่ม recorder_id สำหรับ Audit
        const visitPayload = {
            chief_complaint: allData.chief_complaint,
            present_illness: allData.present_illness,
            plan: allData.plan, 
            diagnosis_note: allData.diagnosis_note,
            referral_department: allData.referral_department,
            referral_notes: allData.referral_notes,

            // ✅ ใช้ชื่อตาม Model Visit.ts
            referral_doctor: allData.referral_doctor, 
            
            // ✅ ใช้ชื่อตาม Model Visit.ts
            status: allData.status, 

            // ✅ Map nurse_id -> UserID (เดิม)
            UserID: allData.nurse_id ? parseInt(allData.nurse_id, 10) : undefined,

            // 🔥 [เพิ่มใหม่] สำหรับฟิลด์ Audit recorder_id ในตาราง Visits
            recorder_id: allData.nurse_id ? parseInt(allData.nurse_id, 10) : undefined 
        };

        // Debug ดูค่าที่จะส่งให้ Sequelize
        console.log(`💾 [DEBUG] Payload -> UserID: ${visitPayload.UserID}`);
        console.log(`💾 [DEBUG] Payload -> recorder_id: ${visitPayload.recorder_id}`);
        console.log(`💾 [DEBUG] Payload -> referral_doctor: ${visitPayload.referral_doctor}`);
        console.log(`💾 [DEBUG] Payload -> status: ${visitPayload.status}`);

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
                // 🔥 [เพิ่มใหม่] สำหรับฟิลด์ Audit recorded_by ในตาราง vital_signs
                recorded_by: allData.nurse_id ? parseInt(allData.nurse_id, 10) : undefined 
            };

            const existingVital = await VitalSign.findOne({ where: { visit_id: visitId }, transaction: t });
            if (existingVital) {
                await existingVital.update(vitalSignPayload, { transaction: t });
            } else {
                await VitalSign.create(vitalSignPayload, { transaction: t });
            }
        }

        await t.commit();

        // ตรวจสอบผลลัพธ์
        const verifiedVisit = await Visit.findByPk(visitId);
        console.log(`✅ [DEBUG] Update Success!`);
        console.log(`🔎 [DEBUG] Saved 'referral_doctor': ${verifiedVisit?.referral_doctor}`);
        console.log(`🔎 [DEBUG] Saved 'status': ${verifiedVisit?.status}`);
        console.log(`🔎 [DEBUG] Saved 'recorder_id': ${verifiedVisit?.recorder_id}`);
        console.log(`=========================================\n`);

        res.status(200).json({ message: `Visit ID ${visitId} updated successfully.` });

    } catch (error) {
        await t.rollback();
        console.error("❌ Error updating visit:", error);
        next(error);
    }
};
// ... ส่วนอื่นคงเดิม

// ... (ส่วนอื่นเหมือนเดิม) ...

// ==========================================
// 4. Get Visit Details
// ==========================================
export const getVisitDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) return res.status(400).json({ message: "Invalid Visit ID" });

        // 1. ดึงข้อมูล Visit หลัก
        const visitData = await Visit.findOne({
            where: { visit_id: visitId },
            include: [
                { model: Patient, as: 'Patient' },
                { model: VitalSign, as: 'vitalSign' },
                {
                    model: VisitSymptom,
                    as: 'symptoms',
                    include: [{ model: Symptom, as: 'symptom', attributes: ['symptom_name'] }]
                }
            ]
        });

        if (!visitData) return res.status(404).json({ message: 'Visit not found' });

        // 2. ดึงข้อมูล Procedures
        const rawProceduresData = await VisitProcedure.findAll({
            where: { visit_id: visitId },
            include: [
                { model: Service, as: 'service', attributes: ['service_name'] },
                { model: Procedure, as: 'procedure', attributes: ['procedure_name'] },
                { model: Diagnosis, as: 'diagnosis', attributes: ['diagnosis_name'] } 
            ]
        });

        // 3. ดึงข้อมูลยา
        const prescriptionsData = await Prescription.findAll({
            where: { visit_id: visitId },
            include: [
                { model: Product, as: 'product', attributes: ['product_name'] }
            ]
        });

        // 4. เตรียมข้อมูลผู้ป่วย
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

        // 5. Map Data
        const diagnoses = rawProceduresData
            .filter((p: any) => p.diagnosis)
            .map((p: any) => ({ name: p.diagnosis.diagnosis_name, code: '' }));

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
            diagnoses: diagnoses,
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

export const updateVisitProcedures = async (req: Request, res: Response, next: NextFunction) => {
    const t = await db.sequelize.transaction();
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        
        // 🔥 รับ ID ผู้ทำรายการ (รองรับทั้งส่งมาในชื่อ userId, nurse_id หรือ doctor_id)
        const { diagnoses, services, procedures, userId, doctor_id, nurse_id } = req.body;
        const currentUserId = doctor_id || nurse_id || userId; 

        if (isNaN(visitId)) {
            await t.rollback();
            return res.status(400).json({ message: 'Invalid Visit ID' });
        }

        // ล้างข้อมูล Procedures เดิมของเคสนี้ออกก่อน
        await VisitProcedure.destroy({ where: { visit_id: visitId }, transaction: t });

        // 1. จัดการข้อมูลการวินิจฉัย (Diagnoses)
        if (diagnoses && diagnoses.length > 0) {
            for (const item of diagnoses) {
                // ค้นหาหรือสร้างชื่อโรคใหม่
                const [diagObj] = await Diagnosis.findOrCreate({
                    where: { diagnosis_name: item.name },
                    defaults: { 
                        diagnosis_name: item.name,
                        // 🔥 บันทึก ID หมอผู้เป็นเจ้าของความเห็นโรคครั้งแรกลงในตาราง diagnoses
                        doctor_id: currentUserId 
                    },
                    transaction: t
                });

                // บันทึกความเชื่อมโยงในตารางหลัก
                await VisitProcedure.create({
                    visit_id: visitId,
                    diagnosis_id: diagObj.id,
                    // 🔥 บันทึก ID ผู้กดบันทึกรายการนี้
                    recorded_by: currentUserId 
                }, { transaction: t });
            }
        }

        // 2. จัดการข้อมูลบริการ (Services)
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
                    // 🔥 บันทึก ID ผู้กดบันทึกรายการนี้
                    recorded_by: currentUserId 
                }, { transaction: t });
            }
        }

        // 3. จัดการข้อมูลหัตถการ (Procedures)
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
                    // 🔥 บันทึก ID ผู้กดบันทึกรายการนี้
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

export const updateVisitSymptoms = async (req: Request, res: Response, next: NextFunction) => {
    const t = await db.sequelize.transaction();
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        
        // 🔥 ดึง ID ผู้บันทึก (พยาบาล/เจ้าหน้าที่) จาก Body
        const recorderId = req.body.nurse_id || req.body.UserID;

        let symptomsData = req.body; 
        if (!Array.isArray(symptomsData) && symptomsData.symptoms) symptomsData = symptomsData.symptoms;
        if (!Array.isArray(symptomsData)) symptomsData = Array.isArray(symptomsData) ? symptomsData : (symptomsData ? [symptomsData] : []);

        if (isNaN(visitId)) {
             await t.rollback();
             return res.status(400).json({ message: 'Invalid Visit ID' });
        }

        // ลบข้อมูลเดิมออกก่อนเพื่อบันทึกชุดใหม่เข้าไป
        await VisitSymptom.destroy({ where: { visit_id: visitId }, transaction: t });

        const newRecords = [];
        let presentIllnessUpdate = null;
        let rosUpdate: any = {};

        for (const item of symptomsData) {
            // เช็คว่าเป็นข้อมูล PI หรือ ROS หรือไม่
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

            // ถ้าเป็นรายการอาการสำคัญ (Chief Complaint)
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
                        // 🔥 [เพิ่มใหม่] บันทึก ID พยาบาลผู้ซักประวัติลงในแต่ละรายการอาการ
                        recorded_by: recorderId 
                    });
                }
            }
        }

        // บันทึกรายการอาการแบบ Bulk
        if (newRecords.length > 0) {
            await VisitSymptom.bulkCreate(newRecords, { transaction: t });
        }

        // เตรียมข้อมูลอัปเดตลงตาราง Visit
        const updatePayload: any = {};
        
        // 🔥 [เพิ่มใหม่] บันทึก ID ผู้แก้ไขประวัติลงในตาราง Visit หลัก
        if (recorderId) {
            updatePayload.recorder_id = recorderId;
        }

        if (presentIllnessUpdate !== null) {
            updatePayload.present_illness = presentIllnessUpdate; 
        }
        
        if (Object.keys(rosUpdate).length > 0) {
             Object.assign(updatePayload, rosUpdate);
        }

        // ถ้ามีการอัปเดต PI, ROS หรือต้องการบันทึก Audit ID
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