import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface SymptomAttributes {
  symptom_id: number; // 👈 ใช้ symptom_id
  symptom_name: string;
}

class Symptom extends Model<SymptomAttributes> implements SymptomAttributes {
  public symptom_id!: number;
  public symptom_name!: string;

  static associate(models: any) {
    this.hasMany(models.VisitSymptom, {
      foreignKey: 'symptom_id',
      as: 'visitSymptoms'
    });
  }
}

Symptom.init({
  symptom_id: { // 👈 กำหนด PK เป็น symptom_id
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  symptom_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'symptoms',
  timestamps: false
});

export default Symptom;