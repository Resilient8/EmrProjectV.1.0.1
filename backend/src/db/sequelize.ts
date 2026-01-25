import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

// 1. ตรวจสอบว่ารันบน Production (Render) หรือเครื่องตัวเอง
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_HOST?.includes('aivencloud.com');

// ในไฟล์ src/db/sequelize.ts

const sequelize = new Sequelize(
    process.env.DATABASE_NAME as string,
    process.env.DATABASE_USER as string,
    process.env.DATABASE_PASSWORD as string,
    {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 17790,
        dialect: 'mysql',
        logging: false,
        // 🔥 เพิ่มส่วนนี้เข้าไป 🔥
        define: {
            freezeTableName: true, // ห้าม Sequelize เปลี่ยนชื่อตารางเอง
            underscored: true      // ใช้ตัวพิมพ์เล็กและ snake_case
        },
        dialectOptions: isProduction ? {
            ssl: { rejectUnauthorized: false }
        } : {}
    }
);

export default sequelize;