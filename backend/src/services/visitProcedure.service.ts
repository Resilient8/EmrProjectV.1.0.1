// src/services/visitProcedure.service.ts (เวอร์ชันอัปเกรด)

import db from '../db'; // Import db object ที่มีทุกอย่างจาก index.ts
import { IProcedureInput, IProcedureOutput } from '../models/visitProcedures';

const { VisitProcedure, Service, Procedure, Diagnosis, sequelize } = db;

export class VisitProcedureService {

  static async createMultipleProcedures(visitId: number, procedures: IProcedureInput[]): Promise<void> {
    // ใช้ Transaction ของ Sequelize เพื่อความปลอดภัย
    const t = await sequelize.transaction();
    try {
      // 1. ลบรายการเก่าของ visitId นี้ทิ้งทั้งหมดก่อน
      await VisitProcedure.destroy({
        where: { visit_id: visitId },
        transaction: t
      });

      // 2. เตรียมข้อมูลใหม่ทั้งหมดที่จะ Insert
      const proceduresToCreate = await Promise.all(procedures.map(async (proc) => {
        // ใช้ Sequelize หา ID จากชื่อให้เราอัตโนมัติ (ถ้าไม่มีก็หาไม่เจอ -> null)
        const service = await Service.findOne({ where: { service_name: proc.service }, transaction: t });
        const procedure = proc.procedure ? await Procedure.findOne({ where: { procedure_name: proc.procedure }, transaction: t }) : null;
        const diagnosis = proc.diagnosis ? await Diagnosis.findOne({ where: { diagnosis_name: proc.diagnosis }, transaction: t }) : null;

        return {
          visit_id: visitId,
          service_id: service?.service_id || null,
          procedure_id: procedure?.procedure_id || null,
          diagnosis_id: diagnosis?.diagnosis_id || null,
          notes: proc.notes || null,
        };
      }));

      // 3. สั่ง Bulk Create เพื่อเพิ่มข้อมูลทั้งหมดในครั้งเดียว (มีประสิทธิภาพกว่า)
      if (proceduresToCreate.length > 0) {
        await VisitProcedure.bulkCreate(proceduresToCreate, { transaction: t });
      }

      // 4. ถ้าทุกอย่างสำเร็จ ให้ commit transaction
      await t.commit();

    } catch (error) {
      // 5. ถ้ามีอะไรผิดพลาด ให้ rollback transaction
      await t.rollback();
      console.error('Transaction failed for adding procedures:', error);
      throw new Error('Failed to save procedures.');
    }
  }

  static async getProceduresWithNamesByVisitId(visitId: number): Promise<IProcedureOutput[]> {
    try {
      // ใช้ .findAll พร้อมกับ `include` เพื่อ JOIN ตารางโดยอัตโนมัติ
      const results = await VisitProcedure.findAll({
        where: { visit_id: visitId },
        include: [
          {
            model: Service,
            attributes: ['service_name'], // ดึงมาแค่ชื่อ
            required: false // ใช้ LEFT JOIN
          },
          {
            model: Procedure,
            attributes: ['procedure_name'],
            required: false
          },
          {
            model: Diagnosis,
            attributes: ['diagnosis_name'],
            required: false
          }
        ],
        attributes: ['id', 'visit_id', 'notes'], // เลือกคอลัมน์จากตารางหลัก
        raw: true, // ทำให้ผลลัพธ์เป็น JSON ธรรมดา
        nest: true  // จัดกลุ่มผลลัพธ์ที่ JOIN มา
      });

      // จัดรูปแบบข้อมูลใหม่ให้ตรงกับ IProcedureOutput
      return results.map((r: any) => ({
        id: r.id,
        visit_id: r.visit_id,
        notes: r.notes,
        service_name: r.Service?.service_name || null,
        procedure_name: r.Procedure?.procedure_name || null,
        diagnosis_name: r.Diagnosis?.diagnosis_name || null,
      }));

    } catch (error) {
      console.error('Error fetching procedures with names:', error);
      throw new Error('Failed to retrieve procedures.');
    }
  }
}