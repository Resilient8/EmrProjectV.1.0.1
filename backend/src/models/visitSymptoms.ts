// src/models/visitSymptoms.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface VisitSymptomAttributes {
  visit_symptom_id: number;
  visit_id: number;
  symptom_id: number;
  duration?: string;
  level?: string;
  details?: string;
}

class VisitSymptom extends Model<VisitSymptomAttributes> implements VisitSymptomAttributes {
  public visit_symptom_id!: number;
  public visit_id!: number;
  public symptom_id!: number;
  public duration?: string;
  public level?: string;
  public details?: string;
}

VisitSymptom.init({
  visit_symptom_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  symptom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'VisitSymptoms',
  timestamps: false // ไม่มี createdAt, updatedAt
});

export default VisitSymptom;