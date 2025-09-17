// src/models/visits.ts (เวอร์ชันจัดระเบียบ)
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// ไม่จำเป็นต้อง import Patient, User ที่นี่ เพราะเราจะใช้ผ่าน models object ใน associate()
// ซึ่งเป็นวิธีที่ดีในการป้องกันปัญหา Circular Dependencies (การ import วนลูป)

export interface VisitAttributes {
  visit_id: number;
  patient_id: string;
  visit_datetime: Date;
  temperature?: number;
  pulse?: number;
  respiration?: number;
  blood_pressure?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  waist_circumference?: number;
  allergies?: string;
  underlying_diseases?: string;
  notes?: string;
  UserID?: number;
}

class Visit extends Model<VisitAttributes> implements VisitAttributes {
  public visit_id!: number;
  public patient_id!: string;
  public visit_datetime!: Date;
  public temperature?: number;
  public pulse?: number;
  public respiration?: number;
  public blood_pressure?: string;
  public height?: number;
  public weight?: number;
  public bmi?: number;
  public waist_circumference?: number;
  public allergies?: string;
  public underlying_diseases?: string;
  public notes?: string;
  public UserID?: number;

  static associate(models: any) {
    this.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      targetKey: 'patient_id'
    });

    this.belongsTo(models.User, {
      foreignKey: 'UserID',
      as: 'recordedBy'
    });
  }
}

Visit.init({
  visit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'patients',
      key: 'patient_id',
    }
  },
  visit_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  temperature: { type: DataTypes.DECIMAL(4, 1), allowNull: true },
  pulse: { type: DataTypes.INTEGER, allowNull: true },
  respiration: { type: DataTypes.INTEGER, allowNull: true },
  blood_pressure: { type: DataTypes.STRING(20), allowNull: true },
  height: { type: DataTypes.DECIMAL(5, 1), allowNull: true },
  weight: { type: DataTypes.DECIMAL(5, 1), allowNull: true },
  bmi: { type: DataTypes.DECIMAL(4, 2), allowNull: true },
  waist_circumference: { type: DataTypes.DECIMAL(5, 1), allowNull: true },
  allergies: { type: DataTypes.TEXT, allowNull: true },
  underlying_diseases: { type: DataTypes.TEXT, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id',
    }
  }
}, {
  sequelize,
  tableName: 'Visits',
  timestamps: false
});

export default Visit;