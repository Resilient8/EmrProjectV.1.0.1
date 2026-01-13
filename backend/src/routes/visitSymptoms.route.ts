import { Router } from "express";
// 🔥 แก้ import ให้ตรงกับชื่อใหม่ใน Controller
import { updateVisitSymptoms } from "../controller/visitSymptoms.controller";

const router = Router({ mergeParams: true }); 

// รองรับ POST (ถ้ามีใช้)
router.post("/", updateVisitSymptoms);

// 🔽🔽🔽 [เพิ่มบรรทัดนี้ และใช้ชื่อ updateVisitSymptoms ครับ] 🔽🔽🔽
router.put("/", updateVisitSymptoms); 

export default router;