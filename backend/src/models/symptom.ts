import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface SymptomAttributes {
  symptom_id: number;
  symptom_name: string;
}

class Symptom extends Model<SymptomAttributes> implements SymptomAttributes {
  public symptom_id!: number;
  public symptom_name!: string;
}

Symptom.init({
  symptom_id: {
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