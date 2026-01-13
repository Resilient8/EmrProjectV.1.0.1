import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface ServiceAttributes {
  id: number; // 👈 แก้เป็น id
  service_name: string;
}

class Service extends Model<ServiceAttributes> implements ServiceAttributes {
  public id!: number; // 👈 แก้เป็น id
  public service_name!: string;

  static associate(models: any) {
    this.hasMany(models.VisitProcedure, {
      foreignKey: 'service_id'
    });
  }
}

Service.init({
  id: { // 👈 ใช้ id
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
  tableName: 'services',
  timestamps: false
});

export default Service;