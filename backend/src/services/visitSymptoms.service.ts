// src/services/visitSymptoms.service.ts

import db from '../db';
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
  ChiefComplaint: ISymptomInput[];
  PresentIllness: string;
  reviewOfSystems: any;
}

export class VisitSymptomService {

  /**
   * สร้างหรืออัปเดตข้อมูลอาการทั้งหมดของ Visit หนึ่งๆ
   * (ฟังก์ชันนี้คือตัวที่ Controller เรียกใช้ และเป็นเวอร์ชันที่แก้ไขแล้ว)
   */
  static async createOrUpdateVisitSymptoms(visitId: number, payload: any[]): Promise<void> {
    //                                                        👆 เปลี่ยน payload ให้เป็น Array of any
    const t = await sequelize.transaction();
    try {
      // 1. ค้นหาข้อมูลสรุป (PresentIllness, ROS) จาก payload ที่ส่งมา
      // ข้อมูลสรุปคือ Object ที่มี ChiefComplaint เป็น null
      const summaryData = payload.find(item => item.ChiefComplaint === null);
      
      if (summaryData) {
        // อัปเดตข้อมูลสรุปนี้กลับไปที่ตาราง 'Visits' หลัก (ถ้ามี)
        await Visit.update({
          PresentIllness: summaryData.PresentIllness,
          ROS_General: summaryData.ROS_General,
          ROS_HeadAndNeck: summaryData.ROS_HeadAndNeck,
          ROS_Respiratory: summaryData.ROS_Respiratory,
          ROS_Cardiovascular: summaryData.ROS_Cardiovascular,
          ROS_Gastrointestinal: summaryData.ROS_Gastrointestinal,
          ROS_Skin: summaryData.ROS_Skin,
        }, {
          where: { visit_id: visitId },
          transaction: t
        });
      }

      // 2. ลบ "อาการสำคัญ" เก่าของ visitId นี้ทิ้งทั้งหมดในตารางเชื่อม (VisitSymptom)
      await VisitSymptom.destroy({
        where: { 
          visit_id: visitId,
        },
        transaction: t
      });
      
      // 3. กรองเอาเฉพาะข้อมูล "อาการสำคัญ" (Chief Complaint) ที่จะสร้างใหม่
      const chiefComplaints = payload.filter(item => item.ChiefComplaint !== null);

      if (chiefComplaints.length > 0) {
        const symptomsToCreate = await Promise.all(
          chiefComplaints.map(async (symptomInput: any) => {
            // หา symptom_id จากตาราง Symptoms หลักก่อน (ถ้าไม่มีก็สร้างใหม่)
            const [symptomMaster] = await Symptom.findOrCreate({
              where: { symptom_name: symptomInput.ChiefComplaint }, // ใช้ symptomInput.ChiefComplaint
              defaults: { symptom_name: symptomInput.ChiefComplaint },
              transaction: t
            });
            
            // เตรียมข้อมูลสำหรับบันทึกลงตาราง VisitSymptom
            return {
              visit_id: visitId,
              symptom_id: symptomMaster.symptom_id,
              ChiefComplaint: symptomInput.ChiefComplaint,
              duration: symptomInput.duration || null,
              level: symptomInput.level || 'pain',
              details: symptomInput.details || null,
            };
          })
        );
        
        // 4. เพิ่มข้อมูลอาการสำคัญทั้งหมดลงในตารางเชื่อมในครั้งเดียว
        if (symptomsToCreate.length > 0) {
          await VisitSymptom.bulkCreate(symptomsToCreate, { transaction: t });
        }
      }

      // 5. ถ้าทุกอย่างเรียบร้อย ให้ commit
      await t.commit();
      
    } catch (error) {
      // 6. ถ้ามีปัญหา ให้ rollback
      await t.rollback();
      console.error('Transaction failed for adding/updating symptoms:', error);
      throw error; // โยน error กลับไปให้ controller จัดการต่อ
    }
  }


  /**
   * ดึงข้อมูลอาการทั้งหมดของ Visit หนึ่งๆ พร้อมชื่ออาการ
   */
  static async getSymptomsByVisitId(visitId: number): Promise<any> {
    try {
      const visitWithSymptoms = await Visit.findByPk(visitId, {
        include: [{
          model: Symptom,
          as: 'symptoms',
          attributes: ['symptom_name'],
          through: {
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