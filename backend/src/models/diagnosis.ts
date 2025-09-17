import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

class Diagnosis extends Model {
  public diagnosis_id!: number;
  public diagnosis_name!: string;
}

Diagnosis.init({
  diagnosis_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  diagnosis_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'diagnosis', // ชื่อตารางในฐานข้อมูล
  timestamps: false
});

export default Diagnosis;