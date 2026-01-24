// src/config/db.ts
import { createPool, Pool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const pool: Pool = createPool({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10,
    
    // --- เพิ่มตรงนี้เพื่อความเทพ ---
    // ถ้าไม่ใช่ localhost ให้เปิดใช้งาน SSL (เพราะ Aiven บังคับ)
    ssl: process.env.DATABASE_HOST !== "127.0.0.1" && process.env.DATABASE_HOST !== "localhost" 
        ? { rejectUnauthorized: false } 
        : undefined
});

console.log(`Connected to Database: ${process.env.DATABASE_NAME} at ${process.env.DATABASE_HOST}`);