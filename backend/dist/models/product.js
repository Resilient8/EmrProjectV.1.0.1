"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/product.ts (เวอร์ชันที่สมบูรณ์)
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
// สร้าง Sequelize Model
class Product extends sequelize_1.Model {
}
// กำหนดโครงสร้างตาราง
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2), // DECIMAL เหมาะสำหรับข้อมูลทางการเงิน/ราคา
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'products',
    timestamps: false
});
// ทำให้ไฟล์นี้มี Default Export เหมือนไฟล์อื่นๆ
exports.default = Product;
