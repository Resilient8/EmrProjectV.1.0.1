// src/config/db.ts

// นำเข้าฟังก์ชัน createPool จาก mysql2/promise เพื่อสร้าง pool ของการเชื่อมต่อแบบ Promise-based
import { createPool, Pool } from "mysql2/promise"; // *** แก้ไขบรรทัดนี้: เพิ่ม /promise และ import Pool type ***

// นำเข้าโมดูล dotenv เพื่อโหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
import * as dotenv from "dotenv";

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
dotenv.config();

// สร้าง pool ของการเชื่อมต่อฐานข้อมูล MySQL
// *** เปลี่ยนชื่อ connection เป็น pool ตรงนี้เลย เพื่อให้ตรงกับที่ Services คาดหวัง ***
export const pool: Pool = createPool({ // *** แก้ไขตรงนี้: เปลี่ยนชื่อและกำหนด type เป็น Pool ***
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10), // เพิ่ม as string เพื่อให้ TypeScript ทราบว่าเป็น string
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    connectionLimit: 10,
});

console.log("Database connection pool created.");

// *** ลบบรรทัด export const promisePool = connection.promise(); ออกไป ***
// เพราะ createPool จาก 'mysql2/promise' มันเป็น Promise-based Pool อยู่แล้ว
// และเรา export 'pool' ตัวนี้ไปใช้โดยตรงใน Services