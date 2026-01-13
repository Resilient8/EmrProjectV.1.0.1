import { Request, Response, NextFunction } from "express";
import db from '../db';

const { Prescription, User } = db;

/**
 * 1. บันทึกรายการยา (savePrescriptions) - แก้ไขปัญหาเรื่องยาซ้ำ
 */
export const savePrescriptions = async (req: Request, res: Response, next: NextFunction) => {
    const t = await db.sequelize.transaction();
    
    try {
        const visitId = parseInt(req.params.visit_id, 10);
        const { items, userId, doctor_id, pharmacist_id } = req.body; 

        // 🔥 แก้จุดบันทึกคนบันทึก: ถ้าข้างนอกไม่มี ให้ไปควานหาจาก item แรก
        const currentUserId = doctor_id || userId || pharmacist_id || (items && items[0]?.edited_by);

        if (!items || !Array.isArray(items)) {
             if (t && !(t as any).finished) await t.rollback();
             return res.status(200).json({ message: 'No medication items found' });
        }

        console.log(`[Prescription] Syncing records for Visit ${visitId} by User: ${currentUserId}`);

        // 1. ล้างกระดาน (Delete All)
        await Prescription.destroy({ where: { visit_id: visitId }, transaction: t });

        // 2. 🔥 กรองยาซ้ำ (Unique Check) - ป้องกันหน้าบ้านส่งยาตัวเดียวกันมาซ้ำๆ
        const seenDrugs = new Set();
        const uniqueItems = items.filter(item => {
            const drugKey = `${item.drug_id}-${item.drug_name}`;
            if (seenDrugs.has(drugKey)) return false;
            seenDrugs.add(drugKey);
            return true;
        });

        // 3. Mapping ข้อมูล
        const records = uniqueItems.map((item: any) => ({
            visit_id: visitId,
            drug_id: item.drug_id || null,
            drug_name: item.drug_name || item.name,
            quantity: item.quantity,
            dosage: item.dosage,
            instruction: item.instruction,
            is_dispensed: item.is_dispensed === true || item.dispensed === true,
            
            // บันทึกคนสั่ง/คนแก้
            prescribed_by: item.prescribed_by || (isNaN(parseInt(currentUserId)) ? null : parseInt(currentUserId)),
            is_edited: item.is_edited || false,
            edited_by: item.edited_by || currentUserId?.toString(),
            edit_history: item.edit_history || null 
        }));

        if (records.length > 0) {
            await Prescription.bulkCreate(records, { transaction: t });
        }

        await t.commit();
        console.log(`✅ [Success] Final Sync: ${records.length} unique items for Visit ${visitId}`);
        
        res.status(200).json({ 
            message: 'บันทึกสำเร็จ',
            count: records.length,
            recorder: currentUserId
        });

    } catch (error) {
        if (t && !(t as any).finished) await t.rollback();
        console.error("❌ Error:", error);
        next(error);
    }
};

/**
 * 2. ดึงรายการยา (getPrescriptionsByVisitId)
 */
export const getPrescriptionsByVisitId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitId = parseInt(req.params.visit_id, 10);

        if (isNaN(visitId)) {
            return res.status(400).json({ message: 'Invalid Visit ID' });
        }

        const prescriptions = await Prescription.findAll({
            where: { visit_id: visitId },
            include: [
                { 
                    model: User, 
                    as: 'prescriber', // ตรวจสอบ alias นี้ในไฟล์ db/index.ts หรือ model ด้วย
                    attributes: ['first_name', 'last_name', 'prefix'] 
                }
            ],
            order: [['id', 'ASC']] 
        });

        res.status(200).json(prescriptions);

    } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
        next(error);
    }
};