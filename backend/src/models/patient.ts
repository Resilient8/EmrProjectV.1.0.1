import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize'; // ตรวจสอบ path นี้ให้ตรงกับโปรเจคจริงของคุณ

export interface PatientAttributes {
  id: number;
  prefix: string;
  first_name: string;
  last_name: string;
  address: string;
  patient_id: string;
  birth_date: Date;
  status?: string;
  
  // ข้อมูลการแพทย์
  blood_group?: string;
  underlying_disease?: string;
  drug_allergies?: string;
  food_allergies?: string;

  // 🔥 รูปโปรไฟล์ (เพิ่มใหม่)
  avatar_url?: string;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
  public id!: number;
  public prefix!: string;
  public first_name!: string;
  public last_name!: string;
  public address!: string;
  public patient_id!: string;
  public birth_date!: Date;
  public status?: string;
  
  // ข้อมูลการแพทย์
  public blood_group?: string;
  public underlying_disease?: string;
  public drug_allergies?: string;
  public food_allergies?: string;

  // 🔥 รูปโปรไฟล์
  public avatar_url?: string;

  static associate(models: any) {
    this.hasMany(models.Visit, {
      foreignKey: 'patient_id',
      sourceKey:  'patient_id',
      as: 'visits'
    });
  }
}

Patient.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prefix: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  patient_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  // --- ข้อมูลการแพทย์ ---
  blood_group: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  underlying_disease: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  drug_allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  food_allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // 🔥 รูปโปรไฟล์ (เพิ่มใหม่)
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  sequelize,
  tableName: 'patients',
  timestamps: false
});

export default Patient;