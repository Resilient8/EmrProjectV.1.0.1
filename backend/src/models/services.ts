import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

class Service extends Model {
  public service_id!: number;
  public service_name!: string;
}

Service.init({
  service_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  service_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'services', // ชื่อตารางในฐานข้อมูล
  timestamps: false
});

export default Service;