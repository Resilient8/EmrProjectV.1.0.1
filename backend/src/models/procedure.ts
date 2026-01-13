import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface ProcedureAttributes {
  procedure_id: number;
  procedure_name: string;
}

class Procedure extends Model<ProcedureAttributes> implements ProcedureAttributes {
  public procedure_id!: number;
  public procedure_name!: string;

  static associate(models: any) {
    // เชื่อมกับ VisitProcedure
    this.hasMany(models.VisitProcedure, {
      foreignKey: 'procedure_id', // ต้องตรงกับ FK ในตาราง VisitProcedures
      as: 'visitProcedures'       // ตั้งชื่อ alias เผื่อเรียกใช้
    });
  }
}

Procedure.init({
  procedure_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'procedure_id' // ระบุ field ให้ชัวร์ว่าตรงกับ DB
  },
  procedure_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'procedure_name' // ระบุ field ให้ชัวร์
  },
}, {
  sequelize,
  tableName: 'procedures', // เช็คชื่อตารางใน DB (น่าจะมี s)
  timestamps: false
});

export default Procedure;