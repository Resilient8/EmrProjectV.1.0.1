// src/models/product.ts (เวอร์ชันที่สมบูรณ์)
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface สำหรับ Attributes (เปลี่ยนชื่อจาก Product เป็น ProductAttributes)
export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
}

// สร้าง Sequelize Model
class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
}

// กำหนดโครงสร้างตาราง
Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // DECIMAL เหมาะสำหรับข้อมูลทางการเงิน/ราคา
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'products',
  timestamps: false
});

// ทำให้ไฟล์นี้มี Default Export เหมือนไฟล์อื่นๆ
export default Product;