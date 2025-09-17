import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface สำหรับนิยาม attributes ของ Department
interface DepartmentAttributes {
  id: number;
  name: string;
}

// ทำให้ id เป็น optional ตอนสร้างข้อมูลใหม่
type DepartmentCreationAttributes = Optional<DepartmentAttributes, 'id'>;

class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
  public id!: number;
  public name!: string;

  // ฟังก์ชันสำหรับสร้างความสัมพันธ์
  static associate(models: any) {
    this.hasMany(models.Doctor, { foreignKey: 'department_id' });
  }
}

Department.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'departments',
  timestamps: false
});

export default Department;