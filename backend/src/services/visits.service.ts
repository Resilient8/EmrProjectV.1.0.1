// src/services/visits.service.ts (เวอร์ชันอัปเกรด)

import db from '../db';
import { VisitAttributes } from '../models/visits';

const { Visit } = db;

export class VisitService {

  /**
   * ดึงข้อมูลการเยี่ยมทั้งหมด
   */
  static async getAllVisits(): Promise<VisitAttributes[]> {
    return await Visit.findAll();
  }

  /**
   * ดึงข้อมูลการเยี่ยมตาม ID
   */
  static async getVisitById(visit_id: number): Promise<VisitAttributes | null> {
    return await Visit.findByPk(visit_id);
  }

  /**
   * ดึงข้อมูลการเยี่ยมของผู้ป่วยตาม Patient ID
   */
  static async getVisitsByPatientId(patientId: string): Promise<VisitAttributes[]> {
    return await Visit.findAll({ where: { patient_id: patientId } });
  }

  /**
   * สร้างข้อมูล Visit ใหม่ (จัดการแค่ตาราง Visits)
   */
  static async createVisit(visitData: Partial<VisitAttributes>): Promise<VisitAttributes> {
    // ใช้ Model.create ของ Sequelize ในการสร้างข้อมูล
    return await Visit.create(visitData);
  }

  /**
   * อัปเดตข้อมูล Visit (จัดการแค่ตาราง Visits)
   */
  static async updateVisit(visit_id: number, visitData: Partial<VisitAttributes>): Promise<[number, VisitAttributes[]]> {
    // ใช้ Model.update ของ Sequelize
    // `returning: true` จะทำให้มันคืนค่า record ที่อัปเดตแล้วกลับมา
    return await Visit.update(visitData, {
      where: { visit_id: visit_id },
      returning: true,
    });
  }

  /**
   * ลบข้อมูล Visit
   */
  static async deleteVisit(visit_id: number): Promise<number> {
    // ใช้ Model.destroy ของ Sequelize
    // เนื่องจากเราตั้งค่า onDelete: 'CASCADE' ใน Migration,
    // ข้อมูลใน VisitSymptoms และ VisitProcedures ที่เกี่ยวข้องจะถูกลบตามไปด้วยโดยอัตโนมัติ
    return await Visit.destroy({ where: { visit_id: visit_id } });
  }
}