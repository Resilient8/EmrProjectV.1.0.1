"use strict";
// src/config/db.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// นำเข้าฟังก์ชัน createPool จาก mysql2/promise เพื่อสร้าง pool ของการเชื่อมต่อแบบ Promise-based
const promise_1 = require("mysql2/promise"); // *** แก้ไขบรรทัดนี้: เพิ่ม /promise และ import Pool type ***
// นำเข้าโมดูล dotenv เพื่อโหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
const dotenv = __importStar(require("dotenv"));
// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
dotenv.config();
// สร้าง pool ของการเชื่อมต่อฐานข้อมูล MySQL
// *** เปลี่ยนชื่อ connection เป็น pool ตรงนี้เลย เพื่อให้ตรงกับที่ Services คาดหวัง ***
exports.pool = (0, promise_1.createPool)({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10), // เพิ่ม as string เพื่อให้ TypeScript ทราบว่าเป็น string
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10,
});
console.log("Database connection pool created.");
// *** ลบบรรทัด export const promisePool = connection.promise(); ออกไป ***
// เพราะ createPool จาก 'mysql2/promise' มันเป็น Promise-based Pool อยู่แล้ว
// และเรา export 'pool' ตัวนี้ไปใช้โดยตรงใน Services
