"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// นำเข้าโมดูล Router จาก Express.js เพื่อสร้าง router สำหรับจัดการเส้นทาง (routes) ที่เกี่ยวข้องกับสินค้า
const express_1 = require("express");
// นำเข้า productController ซึ่งน่าจะมีฟังก์ชันต่างๆ สำหรับจัดการกับสินค้า
// สมมติว่าไฟล์ controller อยู่ในไดเร็กทอรีเดียวกับไฟล์ปัจจุบัน
const product_controller_1 = __importDefault(require("../controller/product.controller"));
// สร้าง router สำหรับจัดการเส้นทางที่เกี่ยวข้องกับสินค้า
const productRouter = (0, express_1.Router)();
// กำหนดเส้นทาง HTTP GET ที่ root path ('/') ของ router นี้
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน getAll จาก productController เพื่อดึงข้อมูลสินค้าทั้งหมด
productRouter.get("/", product_controller_1.default.getAll);
// กำหนดเส้นทาง HTTP DELETE ที่ '/:id' 
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน deleteById จาก productController เพื่อลบสินค้าตาม ID ที่ระบุใน URL
productRouter.delete("/:id", product_controller_1.default.deleteById);
// กำหนดเส้นทาง HTTP POST ที่ root path ('/') 
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน insertProduct จาก productController เพื่อสร้างสินค้าใหม่
productRouter.post("/", product_controller_1.default.insertProduct);
// กำหนดเส้นทาง HTTP PUT ที่ '/:id'
// เมื่อมี request เข้ามาที่เส้นทางนี้ จะเรียกใช้ฟังก์ชัน updateProduct จาก productController เพื่ออัปเดตสินค้าที่มี ID ตรงกับที่ระบุใน URL
productRouter.put("/:id", product_controller_1.default.updateProduct);
// export router นี้ เพื่อให้สามารถนำไปใช้ในส่วนอื่นๆ ของแอปพลิเคชันได้ (เช่น ในไฟล์ index.ts)
exports.default = productRouter;
