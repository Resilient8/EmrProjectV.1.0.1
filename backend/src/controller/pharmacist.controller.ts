import { Request, Response, NextFunction } from "express";
import db from '../db'; 
import { Op } from 'sequelize';

const { Visit, Patient, Prescription, Medication, VitalSign, User } = db; 

// ==========================================
// 1. getPharmacyQueue: ดูคิวคนไข้
// ==========================================
export const getPharmacyQueue = async (req: Request, res: Response) => {
  try {
    const queryDate = req.query.date as string;
    
    const visitWhere: any = {
      status: { [Op.or]: ['รอรับยา', 'กำลังรับยา', 'รักษาเสร็จสิ้น', 'จ่ายยาแล้ว'] }
    };

    if (queryDate && queryDate !== 'all') {
      const startOfDay = new Date(`${queryDate}T00:00:00.000+07:00`);
      const endOfDay = new Date(`${queryDate}T23:59:59.999+07:00`);
      visitWhere.visit_datetime = { [Op.between]: [startOfDay, endOfDay] };
    }

    const queue = await Visit.findAll({ 
      where: visitWhere,
      include: [
        { model: Patient, as: 'Patient', attributes: ['id', 'patient_id', 'prefix', 'first_name', 'last_name', 'avatar_url'] },
        { 
          model: Prescription, 
          as: 'prescriptions',
          required: false,
          include: [{ model: User, as: 'prescribedBy', attributes: ['first_name', 'last_name'] }] 
        },
        // ✅ ใช้ recordedBy ได้เพราะเป็นของตาราง Visit (ไม่ซ้ำกับ VitalSign แล้ว)
        { model: User, as: 'recordedBy', attributes: ['first_name', 'last_name'] }
      ],
      order: [['visit_datetime', 'DESC']] 
    });

    const formattedQueue = queue.map((visit: any) => {
      const patient = visit.Patient || {}; 
      let avatarUrl = null;
      if (patient.avatar_url) {
          const cleanPath = patient.avatar_url.replace(/\\/g, '/');
          avatarUrl = cleanPath.startsWith('http') ? cleanPath : `http://localhost:3000${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
      }

      return {
        visit_id: visit.visit_id, 
        patient_id: patient.patient_id,
        patientName: `${patient.prefix || ''}${patient.first_name} ${patient.last_name}`,
        prescriptionCount: visit.prescriptions ? visit.prescriptions.length : 0,
        status: visit.status,
        time: new Date(visit.visit_datetime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        avatarUrl: avatarUrl,
        doctor_name: visit.prescriptions?.[0]?.prescribedBy ? `${visit.prescriptions[0].prescribedBy.first_name} ${visit.prescriptions[0].prescribedBy.last_name}` : 'ไม่ระบุ',
        nurse_name: visit.recordedBy ? `${visit.recordedBy.first_name} ${visit.recordedBy.last_name}` : 'ไม่ระบุ'
      };
    });

    res.status(200).json(formattedQueue);
  } catch (error: any) {
    console.error("Queue Error:", error);
    res.status(500).json({ message: 'Error fetching pharmacy queue', error: error.message });
  }
};

// ==========================================
// 2. getDispenseDetails: ดูรายละเอียดก่อนจ่าย
// ==========================================
export const getDispenseDetails = async (req: Request, res: Response) => {
    try {
        const { visitId } = req.params;
        const visit = await Visit.findOne({
            where: { visit_id: visitId },
            include: [
                { model: Patient, as: 'Patient' },
                { 
                    model: Prescription, 
                    as: 'prescriptions',
                    include: [{ model: User, as: 'prescribedBy', attributes: ['first_name', 'last_name'] }] 
                },
                { 
                    model: VitalSign, 
                    as: 'vitalSign',
                    // 🔥 แก้ไขจาก recordedBy เป็น vitalsRecorder ตามที่แก้ใน db/index.ts
                    include: [{ model: User, as: 'vitalsRecorder', attributes: ['first_name', 'last_name'] }] 
                },
                { model: User, as: 'recordedBy', attributes: ['first_name', 'last_name'] }
            ]
        });
        
        if (!visit) return res.status(404).json({ message: 'Visit not found' });
        res.status(200).json(visit);
    } catch (error: any) {
        console.error("Details Error:", error);
        res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
}

// ==========================================
// 3. confirmDispense: ยืนยันจ่ายยา (Safe Rollback Version)
// ==========================================
export const confirmDispense = async (req: Request, res: Response) => {
    const t = await db.sequelize.transaction();
    try {
        const { visitId } = req.params;
        const { pharmacist_id, pharmacist_name } = req.body; 

        const prescriptions = await Prescription.findAll({ where: { visit_id: visitId }, transaction: t });

        for (const p of prescriptions) {
             const drugId = p.getDataValue('drug_id');
             if (drugId) {
                 const qtyString = p.getDataValue('quantity') || "0";
                 const qty = parseInt(qtyString.replace(/\D/g, '')) || 0; 

                 if (qty > 0) {
                     await Medication.decrement('stock_quantity', { 
                         by: qty,
                         where: { id: drugId },
                         transaction: t
                     });
                 }
             }
             
             await p.update({ 
                is_dispensed: true,
                edited_by: pharmacist_name || String(pharmacist_id), 
                edit_history: `Dispensed at ${new Date().toLocaleString('th-TH')}`
             }, { transaction: t });
        }

        await Visit.update({ status: 'จ่ายยาแล้ว' }, {
            where: { visit_id: visitId },
            transaction: t
        });

        await t.commit();
        res.status(200).json({ message: 'Dispense completed & Stock updated' });
    } catch (error: any) {
        if (t && !(t as any).finished) { 
            await t.rollback();
        }
        console.error("Dispense Error:", error);
        res.status(500).json({ message: 'Error dispensing', error: error.message });
    }
}

// ==========================================
// 4. updateDispenseProcess: บันทึกสถานะระหว่างทำ
// ==========================================
export const updateDispenseProcess = async (req: Request, res: Response) => {
    const t = await db.sequelize.transaction();
    try {
        const { visitId } = req.params;
        const { status, prescriptions, notes, pharmacist_id } = req.body; 

        const updateData: any = {};
        if (status) updateData.status = status;
        if (notes) updateData.pharmacist_notes = JSON.stringify(notes); 

        if (Object.keys(updateData).length > 0) {
            await Visit.update(updateData, { where: { visit_id: visitId }, transaction: t });
        }

        if (prescriptions && Array.isArray(prescriptions)) {
            for (const item of prescriptions) {
                if (item.id) {
                    await Prescription.update({
                        is_dispensed: item.dispensed,
                        edited_by: String(pharmacist_id),
                        is_edited: true
                    }, { where: { id: item.id }, transaction: t });
                }
            }
        }

        await t.commit();
        res.status(200).json({ message: 'Auto-save successful' });
    } catch (error: any) {
        if (t && !(t as any).finished) { 
            await t.rollback();
        }
        console.error("Auto-save Error:", error);
        res.status(500).json({ message: 'Error saving process', error: error.message });
    }
}

// ==========================================
// 5. getActiveDates
// ==========================================
export const getActiveDates = async (req: Request, res: Response) => {
    try {
        const [results] = await db.sequelize.query(`
            SELECT DISTINCT DATE_FORMAT(visit_datetime, '%Y-%m-%d') as active_date
            FROM visits
            WHERE status IN ('รอรับยา', 'กำลังรับยา', 'รักษาเสร็จสิ้น', 'จ่ายยาแล้ว')
            ORDER BY active_date DESC
        `);
        res.status(200).json(results.map((row: any) => row.active_date));
    } catch (error: any) {
        res.status(500).json([]);
    }
};