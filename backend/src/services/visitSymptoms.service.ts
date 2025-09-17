// src/services/visitSymptoms.service.ts (เวอร์ชันอัปเกรด)

import db from '../db';
import { VisitSymptomAttributes } from '../models/visitSymptoms';

const { Visit, Symptom, VisitSymptom, sequelize } = db;

// Interface สำหรับข้อมูล Input ที่รับมาจาก Frontend
interface ISymptomInput {
    name: string;
    duration: string;
    level: string;
    details?: string;
}

// Interface สำหรับข้อมูลภาพรวมของอาการทั้งหมดใน 1 visit
export interface IVisitSymptomPayload {
    chiefComplaint: ISymptomInput[]; // อาการสำคัญ (มาเป็น Array)
    presentIllness: string; // รายละเอียดอาการเพิ่มเติม
    reviewOfSystems: any; // การซักประวัติเพิ่มเติม (อาจจะเป็น object)
}

export class VisitSymptomService {

  /**
   * สร้างหรืออัปเดตข้อมูลอาการทั้งหมดของ Visit หนึ่งๆ
   */
  static async createOrUpdateVisitSymptoms(visitId: number, payload: IVisitSymptomPayload): Promise<void> {
    const t = await sequelize.transaction();
    try {
      // 1. อัปเดตข้อมูลภาพรวม (notes, ROS) ในตาราง Visits หลักก่อน
      await Visit.update({
        notes: payload.presentIllness,
        // สมมติว่า ROS เก็บเป็น JSON ในตาราง Visits
        review_of_systems: payload.reviewOfSystems 
      }, {
        where: { visit_id: visitId },
        transaction: t
      });

      // 2. ลบอาการเก่าของ visitId นี้ทิ้งทั้งหมดในตารางเชื่อม
      await VisitSymptom.destroy({
        where: { visit_id: visitId },
        transaction: t
      });

      // 3. เตรียมข้อมูลอาการใหม่ที่จะสร้าง
      const symptomsToCreate = await Promise.all(
        payload.chiefComplaint.map(async (symptomInput) => {
          // หา symptom_id จาก master table (ถ้าไม่มีก็สร้างใหม่)
          const [symptomMaster] = await Symptom.findOrCreate({
            where: { symptom_name: symptomInput.name },
            defaults: { symptom_name: symptomInput.name },
            transaction: t
          });
          
          return {
            visit_id: visitId,
            symptom_id: symptomMaster.symptom_id,
            duration: symptomInput.duration || null,
            level: symptomInput.level || 'pain',
            details: symptomInput.details || null,
          };
        })
      );
      
      // 4. เพิ่มข้อมูลอาการทั้งหมดลงในตารางเชื่อม
      if (symptomsToCreate.length > 0) {
        await VisitSymptom.bulkCreate(symptomsToCreate, { transaction: t });
      }

      // 5. ถ้าทุกอย่างเรียบร้อย ให้ commit
      await t.commit();
    } catch (error) {
      // 6. ถ้ามีปัญหา ให้ rollback
      await t.rollback();
      console.error('Transaction failed for adding/updating symptoms:', error);
      throw new Error('Failed to save symptoms data.');
    }
  }

  /**
   * ดึงข้อมูลอาการทั้งหมดของ Visit หนึ่งๆ พร้อมชื่ออาการ
   */
  static async getSymptomsByVisitId(visitId: number): Promise<any> {
    try {
      // ใช้ .findByPk พร้อม `include` แบบซ้อนกันเพื่อดึงข้อมูลทั้งหมดในครั้งเดียว
      const visitWithSymptoms = await Visit.findByPk(visitId, {
        include: [{
          model: Symptom,
          as: 'symptoms', // ชื่อ as ที่เราตั้งไว้ใน Model Visit
          attributes: ['symptom_name'], // ดึงมาแค่ชื่อ
          through: {
            // ดึงข้อมูลจากตารางกลาง (VisitSymptoms) มาด้วย
            attributes: ['duration', 'level', 'details'] 
          }
        }],
      });

      if (!visitWithSymptoms) {
        return null;
      }
      
      return visitWithSymptoms.toJSON();

    } catch (error) {
      console.error(`Error fetching symptoms for visit ID ${visitId}:`, error);
      throw new Error('Failed to retrieve visit symptoms.');
    }
  }
}