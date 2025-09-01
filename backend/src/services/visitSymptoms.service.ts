// ในไฟล์ src/services/visitSymptoms.service.ts

import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { IVisitSymptom } from '../models/visitSymptoms';

export class VisitSymptomService {

    /**
     * ดึงข้อมูลอาการตาม Visit ID
     */
    static async getSymptomsByVisitId(visitId: number): Promise<IVisitSymptom | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM VisitSymptoms WHERE VisitID = ?',
            [visitId]
        );
        if (rows.length > 0) {  
            return rows[0] as IVisitSymptom;
        }
        return null;
    }

    /**
     * เพิ่มหรืออัปเดตข้อมูลอาการ
     */
    static async addOrUpdateSymptoms(visitId: number, symptomsData: any): Promise<void> {
        const connection = await pool.getConnection();
        try {
            const existingSymptoms = await this.getSymptomsByVisitId(visitId);

            // =================================================================================
            // ===== START: FIXED CODE BLOCK / จุดที่แก้ไขโค้ด =====
            // =================================================================================
            // เตรียมข้อมูลสำหรับบันทึก โดยแปลง Array ให้เป็น JSON String ก่อน
            const dataToSave: Partial<IVisitSymptom> = {
                VisitID: visitId,
                ChiefComplaint: symptomsData.ChiefComplaint,
                PresentIllness: symptomsData.PresentIllness,
                ROS_General: JSON.stringify(symptomsData.ROS_General || []),
                ROS_HeadAndNeck: JSON.stringify(symptomsData.ROS_HeadAndNeck || []),
                ROS_Respiratory: JSON.stringify(symptomsData.ROS_Respiratory || []),
                ROS_Cardiovascular: JSON.stringify(symptomsData.ROS_Cardiovascular || []),
                ROS_Gastrointestinal: JSON.stringify(symptomsData.ROS_Gastrointestinal || []),
                ROS_Skin: JSON.stringify(symptomsData.ROS_Skin || []),
            };
            // =================================================================================
            // ===== END: FIXED CODE BLOCK / สิ้นสุดส่วนที่แก้ไข =====
            // =================================================================================

            if (existingSymptoms) {
                // ถ้ามีข้อมูลเก่า ให้อัปเดต
                await connection.query<OkPacket>(
                    'UPDATE VisitSymptoms SET ? WHERE VisitID = ?',
                    [dataToSave, visitId]
                );
            } else {
                // ถ้าไม่มี ให้สร้างใหม่
                await connection.query<OkPacket>(
                    'INSERT INTO VisitSymptoms SET ?',
                    [dataToSave]
                );
            }
        } catch (error) {
            console.error('Error in addOrUpdateSymptoms service:', error);
            throw new Error('Failed to save symptoms.');
        } finally {
            connection.release();
        }
    }
}
