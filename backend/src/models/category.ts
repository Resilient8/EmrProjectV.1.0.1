// src/models/category.ts (เวอร์ชันที่สมบูรณ์)
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface สำหรับนิยาม attributes (เปลี่ยนชื่อเล็กน้อยให้เป็นมาตรฐาน)
export interface CategoryAttributes {
  category_id: number;
  category_name: string;
}

// สร้าง Sequelize Model จาก Interface
class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public category_id!: number;
  public category_name!: string;

  // ถ้าตารางนี้มีความสัมพันธ์กับตารางอื่น สามารถเพิ่ม .associate() ที่นี่ได้
  // static associate(models: any) {
  //   // example: this.hasMany(models.Product, { foreignKey: 'category_id' });
  // }
}

// กำหนดโครงสร้างตารางและเชื่อมต่อกับ Sequelize
Category.init({
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  category_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'categories', // แนะนำให้ใช้ชื่อตารางเป็นพหูพจน์
  timestamps: false
});

// ทำให้ไฟล์นี้มี Default Export เหมือนไฟล์อื่นๆ
export default Category;