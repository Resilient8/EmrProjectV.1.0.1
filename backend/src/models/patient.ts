// src/models/patient.ts (กลับสู่เวอร์ชันดั้งเดิม)

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface PatientAttributes {
  id: number;
  prefix: string;
  first_name: string;
  last_name: string;
  address: string;
  patient_id: string; // <-- กลับมาเป็น patient_id
  birth_date: Date;
  status?: string;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
  public id!: number;
  public prefix!: string;
  public first_name!: string;
  public last_name!: string;
  public address!: string;
  public patient_id!: string; // <-- กลับมาเป็น patient_id
  public birth_date!: Date;
  public status?: string;

  static associate(models: any) {
    this.hasMany(models.Visit, {
      foreignKey: 'patient_id',
      sourceKey:  'patient_id', // <-- กลับมาเป็น patient_id
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
  patient_id: { // <-- กลับมาเป็น patient_id
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
  }
}, {
  sequelize,
  tableName: 'patients',
  timestamps: false
});

export default Patient;