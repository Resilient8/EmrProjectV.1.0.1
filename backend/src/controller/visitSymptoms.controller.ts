import { Request, Response, NextFunction } from "express";
import db from '../db';
import { Op } from 'sequelize';

export const updateVisitSymptoms = async (req: Request, res: Response, next: NextFunction) => {
    const t = await db.sequelize.transaction();
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        
        // 1. จัดการข้อมูลนำเข้า: แยกข้อมูลอาการ และ ID พยาบาล/หมอ ออกจาก Body
        let symptomsData = req.body; 
        let recorderId = req.body.nurse_id || req.body.doctor_id || null; // 🔥 ดึง ID ผู้บันทึก

        // รองรับกรณี Frontend ห่อหุ้มมาเป็น { symptoms: [...], nurse_id: X }
        if (!Array.isArray(symptomsData) && symptomsData.symptoms) {
            symptomsData = symptomsData.symptoms;
        }

        // ตรวจสอบความถูกต้องของข้อมูล (Validation)
        if (!Array.isArray(symptomsData)) {
            symptomsData = (typeof symptomsData === 'object' && symptomsData !== null) ? [symptomsData] : [];
        }

        if (isNaN(visitId)) {
             await t.rollback();
             return res.status(400).json({ message: 'Invalid Visit ID' });
        }

        console.log(`[Backend] Updating Symptoms for Visit ${visitId} (Recorded by: ${recorderId})`);

        // 2. ลบรายการ Chief Complaint เก่าออกเพื่อเขียนทับ (Overwrite)
        await db.VisitSymptom.destroy({ where: { visit_id: visitId }, transaction: t });

        const newRecords = [];
        let presentIllnessUpdate = null;
        let rosUpdate: any = {};

        // 3. วนลูปแยกประเภทข้อมูล (CC / PI / ROS)
        for (const item of symptomsData) {
            
            // A. กรณีข้อมูล PI (ประวัติปัจจุบัน) และ ROS (การซักประวัติตามระบบ)
            if (item.PresentIllness !== undefined || item.ROS_General !== undefined) {
                if(item.PresentIllness !== undefined) presentIllnessUpdate = item.PresentIllness;

                // Map ค่าจาก camelCase ใน UI ไปเป็น snake_case ใน Database
                if(item.ROS_General !== undefined) rosUpdate.ros_general = item.ROS_General;
                if(item.ROS_HeadAndNeck !== undefined) rosUpdate.ros_head_and_neck = item.ROS_HeadAndNeck;
                if(item.ROS_Respiratory !== undefined) rosUpdate.ros_respiratory = item.ROS_Respiratory;
                if(item.ROS_Cardiovascular !== undefined) rosUpdate.ros_cardiovascular = item.ROS_Cardiovascular;
                if(item.ROS_Gastrointestinal !== undefined) rosUpdate.ros_gastrointestinal = item.ROS_Gastrointestinal;
                if(item.ROS_Skin !== undefined) rosUpdate.ros_skin = item.ROS_Skin;

                continue;
            }

            // B. กรณีอาการสำคัญรายตัว (Chief Complaint)
            if (item.ChiefComplaint) {
                // ค้นหาหรือสร้างข้อมูลอาการในตาราง Master
                const [symObj] = await db.Symptom.findOrCreate({ 
                    where: { symptom_name: item.ChiefComplaint }, 
                    transaction: t 
                });
                
                const symptomId = symObj.id || symObj.symptom_id;

                if (symptomId) {
                    newRecords.push({
                        visit_id: visitId,
                        symptom_id: symptomId,
                        duration: item.duration || '',
                        level: item.level || 'pain',
                        locations: item.locations || null,
                        recorded_by: recorderId // ✅ บันทึกตัวตนคนซักอาการ
                    });
                }
            }
        }

        // 4. บันทึกอาการรายรายการลงตารางลูก (VisitSymptom)
        if (newRecords.length > 0) {
            await db.VisitSymptom.bulkCreate(newRecords, { transaction: t });
        }

        // 5. อัปเดตข้อมูลภาพรวม (PI / ROS) และตัวตนผู้บันทึกลงตารางแม่ (Visit)
        const updatePayload: any = {};
        
        if (presentIllnessUpdate !== null) {
            updatePayload.present_illness = presentIllnessUpdate; 
        }
        
        if(Object.keys(rosUpdate).length > 0) {
             Object.assign(updatePayload, rosUpdate); 
        }

        // 🔥 เพิ่มการอัปเดต ID พยาบาลลงในช่องคนบันทึกเคสล่าสุด
        if (recorderId) {
            updatePayload.recorder_id = recorderId; 
        }

        if (Object.keys(updatePayload).length > 0) {
            await db.Visit.update(updatePayload, { 
                where: { visit_id: visitId }, 
                transaction: t 
            });
        }

        await t.commit();
        res.status(200).json({ message: 'Symptoms and Audit Log updated successfully' });

    } catch (error) {
        if (t) await t.rollback();
        console.error("❌ Error updating symptoms:", error);
        next(error);
    }
};