import { Request, Response, NextFunction } from "express";
import db from '../db';

const { VisitProcedure, Service, Procedure, Diagnosis } = db;

export const addOrUpdateVisitProcedures = async (req: Request, res: Response, next: NextFunction) => {
  const t = await db.sequelize.transaction();
  
  try {
    const visitId = parseInt(req.params.visit_id, 10);
    
    // 🔥 1. รับค่า doctor_id เพิ่มเติมจากหน้าบ้าน
    const { 
      procedures: rawProcedures = [], 
      diagnoses: rawDiagnoses = [], 
      services: rawServices = [],
      doctor_id = null // ดึง ID หมอผู้บันทึกออกมา
    } = req.body;

    const procedures = Array.isArray(rawProcedures) ? rawProcedures : [];
    const diagnoses = Array.isArray(rawDiagnoses) ? rawDiagnoses : [];
    let services = Array.isArray(rawServices) ? rawServices : [];

    // รวม Services จากรายการ Procedures
    procedures.forEach((p: any) => {
        if(p.service && !services.find((s:any) => s.name === p.service)) {
            services.push({ name: p.service });
        }
    });

    if (isNaN(visitId)) {
      await t.rollback();
      return res.status(400).json({ message: 'Invalid visit_id' });
    }

    console.log(`[Backend] Processing Visit ${visitId} by Doctor ID: ${doctor_id}`);

    // 1. ลบข้อมูลเก่าทิ้งก่อนเพื่อเขียนทับ (Overwrite)
    await VisitProcedure.destroy({ where: { visit_id: visitId }, transaction: t });

    const createPromises: Promise<any>[] = [];

    // 🔥 2. จัดการข้อมูลการวินิจฉัย (Diagnoses)
    for (const item of diagnoses) {
        let diagnosisId = null;
        const name = (item.name || item.diagnosis_name || '').trim();
        if (!name) continue;

        let code = item.diagnosis_code || item.code || item.icd10_code;
        if (!code || typeof code !== 'string' || code.trim() === '') {
            code = name.substring(0, 20); 
        }
        if (!code) { code = `UNK-${Date.now()}`; }

        try {
            // ค้นหาหรือสร้างข้อมูลการวินิจฉัยใหม่
            let diagObj = await Diagnosis.findOne({ 
                where: { diagnosis_name: name }, 
                transaction: t 
            });

            if (!diagObj) {
                diagObj = await Diagnosis.create({
                    diagnosis_name: name,
                    diagnosis_code: code,
                    // 🔥 บันทึก Visit และ Doctor ตอนสร้าง Diagnoses ใหม่
                    visit_id: visitId,
                    doctor_id: doctor_id 
                }, { transaction: t });
            } else {
                // ถ้ามีอยู่แล้ว แต่อาจจะยังไม่มี visit_id หรือ doctor_id ให้สั่ง update
                await diagObj.update({ 
                    visit_id: visitId, 
                    doctor_id: doctor_id 
                }, { transaction: t });
            }
            
            diagnosisId = diagObj.id;

        } catch (diagError) {
            console.error(`[Backend] Error processing diagnosis "${name}":`, diagError);
            continue; 
        }

        // บันทึกลงตารางเชื่อมโยง (VisitProcedure)
        if (diagnosisId) {
            createPromises.push(VisitProcedure.create({
                visit_id: visitId,
                diagnosis_id: diagnosisId,
                notes: item.notes || '',
                // 🔥 บันทึกว่าใครเป็นคนสั่งวินิจฉัยนี้
                recorded_by: doctor_id 
            }, { transaction: t }));
        }
    }

    // 3. จัดการข้อมูลบริการ (Services)
    for (const item of services) {
        let serviceId = null;
        const sName = (item.name || '').trim();
        if (sName && sName !== '-') {
             const serviceObj = await Service.findOne({ where: { service_name: sName }, transaction: t });
             if (serviceObj) serviceId = serviceObj.id;
        }
        if (serviceId) {
            createPromises.push(VisitProcedure.create({ 
                visit_id: visitId, 
                service_id: serviceId,
                // 🔥 บันทึกว่าใครเป็นคนสั่งบริการนี้
                recorded_by: doctor_id 
            }, { transaction: t }));
        }
    }

    // 4. จัดการข้อมูลหัตถการ (Procedures)
    for (const item of procedures) {
        let procedureId = null;
        const pName = (item.name || item.procedure || '').trim();

        if (pName && pName !== '-') {
             const procedureObj = await Procedure.findOne({ where: { procedure_name: pName }, transaction: t });
             if (procedureObj) procedureId = procedureObj.id;
        }

        if (procedureId || (item.notes && item.notes.trim() !== '')) {
            createPromises.push(VisitProcedure.create({
                visit_id: visitId,
                procedure_id: procedureId, 
                notes: item.notes || '',
                // 🔥 บันทึกว่าใครเป็นคนสั่งหัตถการนี้
                recorded_by: doctor_id 
            }, { transaction: t }));
        }
    }

    await Promise.all(createPromises);
    await t.commit();

    console.log(`✅ [Backend] Procedures saved successfully with Doctor ID: ${doctor_id}`);
    res.status(200).json({ message: 'Success' });

  } catch (error) {
    if (t) await t.rollback();
    console.error('[Backend] Critical Error in updateProcedures:', error);
    next(error); 
  }
};

// ฟังก์ชันดึงข้อมูล (คงเดิมไว้)
export const getVisitProcedures = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        if (isNaN(visitId)) return res.status(400).json({ message: 'Invalid visit ID' });

        const procedures = await VisitProcedure.findAll({
            where: { visit_id: visitId },
            include: [
                { model: Service, as: 'service' },
                { model: Procedure, as: 'procedure' },
                { model: Diagnosis, as: 'diagnosis' }
            ]
        });
        
        const result = {
            diagnoses: procedures.filter((p: any) => p.diagnosis).map((p: any) => ({ 
                id: p.id, 
                name: p.diagnosis.diagnosis_name, 
                code: p.diagnosis.diagnosis_code 
            })),
            services: procedures.filter((p: any) => p.service).map((p: any) => ({ 
                id: p.id, 
                name: p.service.service_name 
            })),
            procedures: procedures.filter((p: any) => p.procedure || p.notes).map((p: any) => ({ 
                id: p.id, 
                name: p.procedure?.procedure_name, 
                notes: p.notes 
            }))
        };

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};