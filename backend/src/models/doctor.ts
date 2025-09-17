import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface สำหรับนิยาม attributes ของ Doctor
interface DoctorAttributes {
  user_id: number;
  specialization: string | null;
  license_number: string | null;
  department_id: number | null; // เพิ่ม department_id สำหรับ foreign key
}

class Doctor extends Model<DoctorAttributes> implements DoctorAttributes {
  public user_id!: number;
  public specialization!: string | null;
  public license_number!: string | null;
  public department_id!: number | null;

  // ฟังก์ชันสำหรับสร้างความสัมพันธ์กับตารางอื่น
  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Department, { foreignKey: 'department_id' });
  }
}

Doctor.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  specialization: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departments', // ชื่อตาราง departments
      key: 'id',
    }
  }
}, {
  sequelize,
  tableName: 'doctors',
  timestamps: false
});

export default Doctor;