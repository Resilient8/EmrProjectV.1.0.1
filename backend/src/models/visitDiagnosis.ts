import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

interface VisitDiagnosisAttributes {
  id: number;
  visit_id: number;
  icd10_code: string;    // ✅ แก้เป็น string และชื่อ code
  diagnosis_type?: string;
  doctor_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VisitDiagnosisCreationAttributes extends Optional<VisitDiagnosisAttributes, 'id'> {}

class VisitDiagnosis extends Model<VisitDiagnosisAttributes, VisitDiagnosisCreationAttributes> implements VisitDiagnosisAttributes {
  public id!: number;
  public visit_id!: number;
  public icd10_code!: string; // ✅ แก้เป็น string
  public diagnosis_type!: string;
  public doctor_id!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VisitDiagnosis.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  icd10_code: {  // ✅ แก้ชื่อฟิลด์ให้ตรง DB
    type: DataTypes.STRING, // ✅ แก้ Type
    allowNull: false,
    comment: 'FK to ICD10.code'
  },
  diagnosis_type: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'PRINCIPAL'
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'visit_diagnoses',
  underscored: true,
});

export default VisitDiagnosis;