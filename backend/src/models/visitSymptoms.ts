import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface VisitSymptomAttributes {
  visit_symptom_id?: number;
  visit_id: number;
  symptom_id: number;
  duration?: string | null;
  level?: string | null;
  details?: string | null;
  locations?: any;
  recorded_by?: number | null;
}

class VisitSymptom extends Model<VisitSymptomAttributes> implements VisitSymptomAttributes {
  public visit_symptom_id!: number;
  public visit_id!: number;
  public symptom_id!: number;
  public duration!: string | null;
  public level!: string | null;
  public details!: string | null;
  public locations!: any;
  public recorded_by!: number | null;

  static associate(models: any) {
    this.belongsTo(models.Visit, { foreignKey: 'visit_id', as: 'visit' });
    this.belongsTo(models.Symptom, { foreignKey: 'symptom_id', as: 'symptom' });
    this.belongsTo(models.User, { foreignKey: 'recorded_by', as: 'recordedBy' });
  }
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
    // ✨ เปลี่ยนเป็น 'visits' (ตัวเล็ก)
    references: { model: 'visits', key: 'visit_id' } 
  },
  symptom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // ✨ เปลี่ยนเป็น 'symptoms' (ตัวเล็ก)
    references: { model: 'symptoms', key: 'symptom_id' } 
  },
  duration: { type: DataTypes.STRING, allowNull: true },
  level: { type: DataTypes.STRING, allowNull: true },
  details: { type: DataTypes.TEXT, allowNull: true },
  locations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  recorded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // ✨ เปลี่ยนเป็น 'users' (ตัวเล็ก)
    references: { model: 'users', key: 'user_id' } 
  }
}, {
  sequelize,
  // ✨ แนะนำใช้ 'visit_symptoms' เพื่อความเป็นระเบียบใน Linux
  tableName: 'visit_symptoms', 
  timestamps: false,
  freezeTableName: true,
  underscored: true // บังคับให้เป็นตัวเล็กและใช้ snake_case
});

export default VisitSymptom;