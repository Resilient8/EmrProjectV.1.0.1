import { Router } from "express";
import { 
    getAllVisits, 
    createVisit, 
    getVisitsByPatientId,
    getVisitById,
    getVisitDetails,      
    updateVisitById,      
    deleteVisitById,
    updateVisitSymptoms,
    updateVisitProcedures // ✅ 1. Import ตัวนี้เพิ่มเข้ามาจาก visits.controller
} from "../controller/visits.controller"; 

const router = Router();

// --- Routes หลัก ---
router.get("/", getAllVisits);
router.post("/", createVisit);
router.get("/patient/:patientId", getVisitsByPatientId);

// --- Route ดึงข้อมูล (หน้าห้องตรวจแพทย์) ---
router.get("/details/:visit_id", getVisitDetails); 

// -----------------------------------------------------------
// 💥 ส่วนจัดการ Procedures (Diagnosis + Services + Procedures)
// ✅ 2. แก้ไข: ใช้ updateVisitProcedures ที่เราเพิ่งสร้าง
// -----------------------------------------------------------
router.put("/:visit_id/procedures", updateVisitProcedures);

// (ถ้า Frontend เก่ามีการเรียก POST ก็เปิดบรรทัดนี้ไว้ได้ครับ แต่ปกติใช้ PUT สำหรับ update)
router.post("/:visit_id/procedures", updateVisitProcedures);


// -----------------------------------------------------------
// 💥 ส่วนจัดการ Symptoms (อาการ CC, PI, ROS)
// -----------------------------------------------------------
router.post("/:visit_id/symptoms", updateVisitSymptoms);
router.put("/:visit_id/symptoms", updateVisitSymptoms);

// --- Routes จัดการ Visit รายตัว (วางไว้ท้ายสุด เพื่อป้องกัน Route ชนกัน) ---
router.get("/:visit_id", getVisitById);
router.put("/:visit_id", updateVisitById);
router.delete("/:visit_id", deleteVisitById);

export default router;