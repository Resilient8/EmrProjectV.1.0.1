import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface สำหรับนิยาม attributes ของ Pharmacist
interface PharmacistAttributes {
  user_id: number;
  license_number: string | null;
}

class Pharmacist extends Model<PharmacistAttributes> implements PharmacistAttributes {
  public user_id!: number;
  public license_number!: string | null;

  // ฟังก์ชันสำหรับสร้างความสัมพันธ์
  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Pharmacist.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'pharmacists',
  timestamps: false
});

export default Pharmacist;