// src/db/sequelize.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT } = process.env;

if (!DATABASE_NAME || !DATABASE_USER || !DATABASE_HOST) {
  throw new Error('Please define DATABASE_NAME, DATABASE_USER, and DATABASE_HOST in your .env file');
}

// สร้างและ export instance ของ Sequelize ที่นี่
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD || '', {
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT) || 3306,
  dialect: 'mysql',
  logging: false
});

export default sequelize;