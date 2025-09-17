"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/category.ts (เวอร์ชันที่สมบูรณ์)
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
// สร้าง Sequelize Model จาก Interface
class Category extends sequelize_1.Model {
}
// กำหนดโครงสร้างตารางและเชื่อมต่อกับ Sequelize
Category.init({
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    category_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'categories', // แนะนำให้ใช้ชื่อตารางเป็นพหูพจน์
    timestamps: false
});
// ทำให้ไฟล์นี้มี Default Export เหมือนไฟล์อื่นๆ
exports.default = Category;
