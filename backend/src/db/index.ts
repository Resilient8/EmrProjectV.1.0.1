import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config();

// สร้าง Connection Pool
const pool = mysql.createPool({
  // vvv แก้ไขตรงนี้ vvv
  host: process.env.DATABASE_HOST, // จาก DB_HOST เป็น DATABASE_HOST
  user: process.env.DATABASE_USER, // จาก DB_USER เป็น DATABASE_USER
  password: process.env.DATABASE_PASSWORD, // จาก DB_PASSWORD เป็น DATABASE_PASSWORD
  database: process.env.DATABASE_NAME, // จาก DB_NAME เป็น DATABASE_NAME
  port: Number(process.env.DATABASE_PORT) || 3306, // เพิ่ม port เข้ามาด้วย
  // ^^^ ถึงตรงนี้ ^^^
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// export pool ออกไปเพื่อให้ไฟล์อื่นเรียกใช้ได้
export default pool;