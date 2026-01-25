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
  recorded_by?: number | null; // 🔥 [เพิ่มใหม่] ID พยาบาล/หมอ ผู้ซักประวัติอาการนี้
}

class VisitSymptom extends Model<VisitSymptomAttributes> implements VisitSymptomAttributes {
  public visit_symptom_id!: number;
  public visit_id!: number;
  public symptom_id!: number;
  public duration!: string | null;
  public level!: string | null;
  public details!: string | null;
  public locations!: any;
  public recorded_by!: number | null; // 🔥 [เพิ่มใหม่]

  static associate(models: any) {
    this.belongsTo(models.Visit, { foreignKey: 'visit_id', as: 'visit' });
    this.belongsTo(models.Symptom, { foreignKey: 'symptom_id', as: 'symptom' });
    
    // 🔥 [เพิ่มใหม่] เชื่อมไปที่ User เพื่อดูชื่อผู้บันทึกอาการ
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
    references: { model: 'Visits', key: 'visit_id' }
  },
  symptom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Symptoms', key: 'id' }
  },
  duration: { type: DataTypes.STRING, allowNull: true },
  level: { type: DataTypes.STRING, allowNull: true },
  details: { type: DataTypes.TEXT, allowNull: true },
  locations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  // 🔥 [เพิ่มใหม่] ฟิลด์เก็บตัวตนผู้ซักประวัติ
  recorded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Users', key: 'user_id' }
  }
}, {
  sequelize,
  tableName: 'visitSymptoms', // ✅ ใช้ชื่อเดิมที่คุณตั้งไว้
  timestamps: false 
});

export default VisitSymptom;