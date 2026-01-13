import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './user'; // Import User เพื่อใช้ใน associate (ถ้ามีไฟล์ user.ts)

interface NurseAttributes {
  id: number; // ✅ เพิ่ม id ตามมาตรฐาน DB
  user_id: number;
  license_number: string | null;
  level: string | null;
}

class Nurse extends Model<NurseAttributes> implements NurseAttributes {
  public id!: number;
  public user_id!: number;
  public license_number!: string | null;
  public level!: string | null;

  static associate(models: any) {
    // เชื่อมโยงกับ User
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Nurse.init({
  id: { // ✅ ใช้ id เป็น PK
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true // พยาบาล 1 คน คือ User 1 คน
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'nurses',
  timestamps: true,    // ✅ เปิดใช้งาน created_at, updated_at
  underscored: true    // ✅ แปลง camelCase เป็น snake_case (createdAt -> created_at)
});

export default Nurse;