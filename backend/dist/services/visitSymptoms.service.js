"use strict";
// ในไฟล์ src/services/visitSymptoms.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitSymptomService = void 0;
const db_1 = require("../config/db");
class VisitSymptomService {
    /**
     * ดึงข้อมูลอาการตาม Visit ID
     */
    static getSymptomsByVisitId(visitId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.pool.query('SELECT * FROM VisitSymptoms WHERE VisitID = ?', [visitId]);
            if (rows.length > 0) {
                return rows[0];
            }
            return null;
        });
    }
    /**
     * เพิ่มหรืออัปเดตข้อมูลอาการ
     */
    static addOrUpdateSymptoms(visitId, symptomsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.pool.getConnection();
            try {
                const existingSymptoms = yield this.getSymptomsByVisitId(visitId);
                // =================================================================================
                // ===== START: FIXED CODE BLOCK / จุดที่แก้ไขโค้ด =====
                // =================================================================================
                // เตรียมข้อมูลสำหรับบันทึก โดยแปลง Array ให้เป็น JSON String ก่อน
                const dataToSave = {
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
                    yield connection.query('UPDATE VisitSymptoms SET ? WHERE VisitID = ?', [dataToSave, visitId]);
                }
                else {
                    // ถ้าไม่มี ให้สร้างใหม่
                    yield connection.query('INSERT INTO VisitSymptoms SET ?', [dataToSave]);
                }
            }
            catch (error) {
                console.error('Error in addOrUpdateSymptoms service:', error);
                throw new Error('Failed to save symptoms.');
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.VisitSymptomService = VisitSymptomService;
