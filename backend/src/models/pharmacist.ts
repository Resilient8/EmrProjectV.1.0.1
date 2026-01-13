import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface ต้องมี id และ user_id
interface PharmacistAttributes {
  id: number;       // ✅ เพิ่ม id (Primary Key จริง)
  user_id: number;  // ✅ เป็นแค่ Foreign Key (ไม่ใช่ PK)
  license_number: string | null;
}

class Pharmacist extends Model<PharmacistAttributes> implements PharmacistAttributes {
  public id!: number;
  public user_id!: number;
  public license_number!: string | null;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Pharmacist.init({
  id: { // ✅ ใช้ id เป็น Primary Key
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // เภสัชกรต้องผูกกับ User เสมอ
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'pharmacists',
  timestamps: true,   // ✅ ปกติ Migration จะมี created_at/updated_at
  underscored: true   // ✅ เพื่อให้ mapping ชื่อคอลัมน์ถูกต้อง
});

export default Pharmacist;