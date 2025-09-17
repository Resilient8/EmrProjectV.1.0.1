import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
// ✂️ --- ลบ import ที่ไม่จำเป็นออก ---
// import Doctor from './doctor'; 
// import Pharmacist from './pharmacist';
// ------------------------------------

// Interface สำหรับนิยาม attributes ของ User
interface UserAttributes {
  user_id: number;
  prefix: string | null; // <-- ปรับปรุง
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacist';
}

// ทำให้ user_id เป็น optional ตอนสร้างข้อมูลใหม่
type UserCreationAttributes = Optional<UserAttributes, 'user_id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public prefix!: string | null; // <-- ปรับปรุง
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacist';

  // ฟังก์ชันสำหรับสร้างความสัมพันธ์กับตารางอื่น
  static associate(models: any) {
    // User หนึ่งคน มีข้อมูล Doctor ได้หนึ่งชุด (One-to-One)
    this.hasOne(models.Doctor, {
      foreignKey: 'user_id',
      as: 'doctorInfo'
    });

    // User หนึ่งคน มีข้อมูล Pharmacist ได้หนึ่งชุด (One-to-One)
    this.hasOne(models.Pharmacist, {
      foreignKey: 'user_id',
      as: 'pharmacistInfo'
    });
  }
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prefix: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Doctor', 'Nurse', 'Admin', 'Pharmacist'),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: false
});

export default User;