import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';
import Visit from './visits';

export interface VitalSignAttributes {
  vitals_id: number;
  visit_id: number;
  temperature?: number;
  pulse?: number;
  respiration?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  oxygen_saturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  waist_circumference?: number;
  recorded_by?: number | null; // 🔥 [เพิ่มใหม่] ID พยาบาลผู้บันทึกสัญญาณชีพ
}

class VitalSign extends Model<VitalSignAttributes> implements VitalSignAttributes {
  public vitals_id!: number;
  public visit_id!: number;
  public temperature?: number;
  public pulse?: number;
  public respiration?: number;
  public blood_pressure_systolic?: number;
  public blood_pressure_diastolic?: number;
  public oxygen_saturation?: number;
  public height?: number;
  public weight?: number;
  public bmi?: number;
  public waist_circumference?: number;
  public recorded_by!: number | null; // 🔥 [เพิ่มใหม่]

  public static associate(models: any) {
    this.belongsTo(models.Visit, {
      foreignKey: 'visit_id',
      as: 'visit'
    });

    // 🔥 [เพิ่มใหม่] เชื่อมไปที่ User เพื่อดูว่าพยาบาลคนไหนเป็นคนวัดสัญญาณชีพ
    this.belongsTo(models.User, {
      foreignKey: 'recorded_by',
      as: 'recordedBy'
    });
  }
}

VitalSign.init({
  vitals_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'visits',
      key: 'visit_id',
    },
  },
  temperature: DataTypes.DECIMAL(4, 1),
  pulse: DataTypes.INTEGER,
  respiration: DataTypes.INTEGER,
  blood_pressure_systolic: DataTypes.INTEGER,
  blood_pressure_diastolic: DataTypes.INTEGER,
  oxygen_saturation: DataTypes.INTEGER,
  height: DataTypes.DECIMAL(5, 1),
  weight: DataTypes.DECIMAL(5, 1),
  bmi: DataTypes.DECIMAL(4, 2),
  waist_circumference: DataTypes.INTEGER,
  // 🔥 [เพิ่มใหม่] ฟิลด์เก็บตัวตนพยาบาลผู้บันทึก
  recorded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  sequelize,
  modelName: 'VitalSign',
  tableName: 'vital_signs',
  timestamps: false,
});

export default VitalSign;