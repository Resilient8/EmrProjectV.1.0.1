import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

interface UserAttributes {
  user_id: number;
  prefix: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null; 
  password_hash: string;
  role: 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacist';
  department?: string | null;
  avatar_url?: string | null; // ✅ 1. เพิ่มใน Interface
  created_at?: Date; 
  updated_at?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'user_id' | 'created_at' | 'updated_at'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public prefix!: string | null;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone!: string | null; 
  public password_hash!: string;
  public role!: 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacist';
  public department!: string | null;
  public avatar_url!: string | null; // ✅ 2. เพิ่มใน Class Property
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  static associate(models: any) {
    this.hasOne(models.Doctor, { foreignKey: 'user_id', as: 'doctorInfo' });
    this.hasOne(models.Pharmacist, { foreignKey: 'user_id', as: 'pharmacistInfo' });
    this.hasOne(models.Nurse, { foreignKey: 'user_id', as: 'nurseInfo' });
  }
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prefix: { type: DataTypes.STRING(50), allowNull: true },
  first_name: { type: DataTypes.STRING(255), allowNull: false },
  last_name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  
  department: { 
    type: DataTypes.STRING(100), 
    allowNull: true,
    defaultValue: null 
  },

  // ✅ 3. Map กับ Database ตรงนี้
  avatar_url: { 
    type: DataTypes.STRING(255), 
    allowNull: true,
    defaultValue: null 
  },

  role: {
    type: DataTypes.ENUM('Doctor', 'Nurse', 'Admin', 'Pharmacist'),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  underscored: true 
});

export default User;