"use strict";
// src/services/visitSymptoms.service.ts (เวอร์ชันอัปเกรด)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitSymptomService = void 0;
const db_1 = __importDefault(require("../db"));
const { Visit, Symptom, VisitSymptom, sequelize } = db_1.default;
class VisitSymptomService {
    /**
     * สร้างหรืออัปเดตข้อมูลอาการทั้งหมดของ Visit หนึ่งๆ
     */
    static createOrUpdateVisitSymptoms(visitId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield sequelize.transaction();
            try {
                // 1. อัปเดตข้อมูลภาพรวม (notes, ROS) ในตาราง Visits หลักก่อน
                yield Visit.update({
                    notes: payload.presentIllness,
                    // สมมติว่า ROS เก็บเป็น JSON ในตาราง Visits
                    review_of_systems: payload.reviewOfSystems
                }, {
                    where: { visit_id: visitId },
                    transaction: t
                });
                // 2. ลบอาการเก่าของ visitId นี้ทิ้งทั้งหมดในตารางเชื่อม
                yield VisitSymptom.destroy({
                    where: { visit_id: visitId },
                    transaction: t
                });
                // 3. เตรียมข้อมูลอาการใหม่ที่จะสร้าง
                const symptomsToCreate = yield Promise.all(payload.chiefComplaint.map((symptomInput) => __awaiter(this, void 0, void 0, function* () {
                    // หา symptom_id จาก master table (ถ้าไม่มีก็สร้างใหม่)
                    const [symptomMaster] = yield Symptom.findOrCreate({
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
                })));
                // 4. เพิ่มข้อมูลอาการทั้งหมดลงในตารางเชื่อม
                if (symptomsToCreate.length > 0) {
                    yield VisitSymptom.bulkCreate(symptomsToCreate, { transaction: t });
                }
                // 5. ถ้าทุกอย่างเรียบร้อย ให้ commit
                yield t.commit();
            }
            catch (error) {
                // 6. ถ้ามีปัญหา ให้ rollback
                yield t.rollback();
                console.error('Transaction failed for adding/updating symptoms:', error);
                throw new Error('Failed to save symptoms data.');
            }
        });
    }
    /**
     * ดึงข้อมูลอาการทั้งหมดของ Visit หนึ่งๆ พร้อมชื่ออาการ
     */
    static getSymptomsByVisitId(visitId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ใช้ .findByPk พร้อม `include` แบบซ้อนกันเพื่อดึงข้อมูลทั้งหมดในครั้งเดียว
                const visitWithSymptoms = yield Visit.findByPk(visitId, {
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
            }
            catch (error) {
                console.error(`Error fetching symptoms for visit ID ${visitId}:`, error);
                throw new Error('Failed to retrieve visit symptoms.');
            }
        });
    }
}
exports.VisitSymptomService = VisitSymptomService;
