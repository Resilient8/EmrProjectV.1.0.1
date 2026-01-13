import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';

export interface ICD10Attributes {
  code: string;       // รหัสโรค (PK) เช่น J00
  name_th: string;    // ชื่อไทย
  name_en: string;    // ชื่ออังกฤษ
  category?: string;  // หมวดหมู่
  is_active: boolean; // สถานะ
}

class ICD10 extends Model<ICD10Attributes> implements ICD10Attributes {
  public code!: string;
  public name_th!: string;
  public name_en!: string;
  public category?: string;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ICD10.init({
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name_th: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name_en: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'ICD10',
  tableName: 'icd10', // ชื่อตารางใน DB
  timestamps: true,
  underscored: true
});

export default ICD10;