// นำเข้าโมดูล Router จาก Express.js เพื่อสร้าง router สำหรับจัดการเส้นทาง (routes) ที่เกี่ยวข้องกับสินค้า
import { Router } from "express";

// นำเข้า productController ซึ่งน่าจะมีฟังก์ชันต่างๆ สำหรับจัดการกับสินค้า
// สมมติว่าไฟล์ controller อยู่ในไดเร็กทอรีเดียวกับไฟล์ปัจจุบัน
import productController from "../controller/product.controller";

// สร้าง router สำหรับจัดการเส้นทางที่เกี่ยวข้องกับสินค้า
const productRouter = Router();

// กำหนดเส้นทาง HTTP GET ที่ root path ('/') ของ router นี้
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน getAll จาก productController เพื่อดึงข้อมูลสินค้าทั้งหมด
productRouter.get("/", productController.getAll);

// กำหนดเส้นทาง HTTP DELETE ที่ '/:id' 
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน deleteById จาก productController เพื่อลบสินค้าตาม ID ที่ระบุใน URL
productRouter.delete("/:id", productController.deleteById);

// กำหนดเส้นทาง HTTP POST ที่ root path ('/') 
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน insertProduct จาก productController เพื่อสร้างสินค้าใหม่
productRouter.post("/", productController.insertProduct);

// กำหนดเส้นทาง HTTP PUT ที่ '/:id'
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน updateProduct จาก productController เพื่ออัปเดตสินค้าที่มี ID ตรงกับที่ระบุใน URL
productRouter.put("/:id", productController.updateProduct);

// export router นี้ เพื่อให้สามารถนำไปใช้ในส่วนอื่นๆ ของแอปพลิเคชันได้ (เช่น ในไฟล์ index.ts)
export default productRouter;