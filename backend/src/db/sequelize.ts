import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

// 1. ตรวจสอบว่ารันบน Production (Render) หรือเครื่องตัวเอง
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_HOST?.includes('aivencloud.com');

// 2. สร้าง Instance โดยดึงค่าจาก Environment Variables โดยตรง (ไม่ต้องผ่าน config.json)
const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USER as string,
  process.env.DATABASE_PASSWORD as string,
  {
    host: process.env.DATABASE_HOST,
    // 🔥 จุดสำคัญ 1: เลข Port ของ Aiven คือ 17790 (ไม่ใช่ 3306)
    port: Number(process.env.DATABASE_PORT) || 17790, 
    dialect: 'mysql',
    logging: false,
    // 🔥 จุดสำคัญ 2: Aiven บังคับใช้ SSL ไม่งั้นจะโดนปฏิเสธการเชื่อมต่อ
    dialectOptions: isProduction ? {
      ssl: {
        rejectUnauthorized: false
      }
    } : {}
  }
);

export default sequelize;