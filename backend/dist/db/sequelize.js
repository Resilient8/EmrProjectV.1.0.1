"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/db/sequelize.ts
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT } = process.env;
if (!DATABASE_NAME || !DATABASE_USER || !DATABASE_HOST) {
    throw new Error('Please define DATABASE_NAME, DATABASE_USER, and DATABASE_HOST in your .env file');
}
// สร้างและ export instance ของ Sequelize ที่นี่
const sequelize = new sequelize_1.Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD || '', {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT) || 3306,
    dialect: 'mysql',
    logging: false
});
exports.default = sequelize;
