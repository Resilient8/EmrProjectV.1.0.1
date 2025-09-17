// src/models/visitProcedures.ts (เวอร์ชันสมบูรณ์)
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

// Interface สำหรับ Attributes ใน Sequelize Model (จากเดิมของคุณ)
export interface VisitProcedureAttributes {
  id?: number;
  visit_id: number;
  service_id: number | null;
  procedure_id: number | null;
  diagnosis_id: number | null;
  notes?: string | null;
}

// *** ส่วนของ Sequelize Model ที่เพิ่มเข้ามา ***
class VisitProcedure extends Model<VisitProcedureAttributes> implements VisitProcedureAttributes {
  public id!: number;
  public visit_id!: number;
  public service_id!: number | null;
  public procedure_id!: number | null;
  public diagnosis_id!: number | null;
  public notes!: string | null;
}

VisitProcedure.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  procedure_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diagnosis_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'VisitProcedures',
  timestamps: false
});

export default VisitProcedure;


// ----- Interfaces สำหรับใช้ใน Application Layer (คงไว้ตามเดิม) -----

// Interface สำหรับข้อมูล "ดิบ" ที่รับมาจากหน้าเว็บ (ที่เป็นชื่อ ไม่ใช่ ID)
export interface IProcedureInput {
  service: string;
  procedure: string | null;
  diagnosis: string | null;
  notes: string;
}

// Interface สำหรับข้อมูล "ผลลัพธ์" ที่จะส่งกลับไปให้ Frontend (มีแต่ชื่อ ไม่มี ID)
export interface IProcedureOutput {
  id?: number;
  visit_id: number;
  notes: string | null;
  service_name: string | null;
  procedure_name: string | null;
  diagnosis_name: string | null;
}