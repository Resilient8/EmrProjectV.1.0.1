import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

class Procedure extends Model {
  public procedure_id!: number;
  public procedure_name!: string;
}

Procedure.init({
  procedure_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  procedure_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'procedures', // ชื่อตารางในฐานข้อมูล
  timestamps: false
});

export default Procedure;