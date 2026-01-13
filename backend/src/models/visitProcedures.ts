import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

// Import Models สำหรับการทำ Type Definition (ถ้าจำเป็น)
import Service from './services';     
import Procedure from './procedure';  
import Diagnosis from './diagnosis';  
import Visit from './visits';         

// =========================================================
// 1. Definition of Model Attributes (Interface)
// =========================================================
export interface VisitProcedureAttributes {
  id: number;
  visit_id: number | null;     // ✅ เชื่อมกับ Visit (ปรับเป็น null ได้เพื่อรองรับข้อมูลเก่า)
  service_id: number | null;
  procedure_id: number | null;
  diagnosis_id: number | null;
  notes: string | null;
  recorded_by: number | null;  // 🔥 [Audit] ID ผู้บันทึกหัตถการ (พยาบาล/หมอ)
  createdAt?: Date;
  updatedAt?: Date;
}

// กำหนดฟิลด์ที่ไม่จำเป็นต้องใส่ตอนสร้าง (id เป็น auto-increment)
export interface VisitProcedureCreationAttributes extends Optional<VisitProcedureAttributes, 'id'> {}

// =========================================================
// 2. Model Class Definition
// =========================================================
class VisitProcedure extends Model<VisitProcedureAttributes, VisitProcedureCreationAttributes> implements VisitProcedureAttributes {
  public id!: number;
  public visit_id!: number | null;
  public service_id!: number | null;
  public procedure_id!: number | null;
  public diagnosis_id!: number | null;
  public notes!: string | null;
  public recorded_by!: number | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * สร้างความสัมพันธ์ (Associations)
   */
  static associate(models: any) {
    // 1. เชื่อมกลับไปที่ Visit
    this.belongsTo(models.Visit, { foreignKey: 'visit_id', as: 'visit' });
    
    // 2. เชื่อมกับ Service (บริการ)
    this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    
    // 3. เชื่อมกับ Procedure (หัตถการ)
    this.belongsTo(models.Procedure, { foreignKey: 'procedure_id', as: 'procedure' });
    
    // 4. เชื่อมกับ Diagnosis (การวินิจฉัยที่เกี่ยวข้อง)
    this.belongsTo(models.Diagnosis, { foreignKey: 'diagnosis_id', as: 'diagnosis' });

    // 5. 🔥 [Audit] เชื่อมไปที่ User เพื่อดูชื่อผู้บันทึก/สั่งหัตถการ
    this.belongsTo(models.User, { foreignKey: 'recorded_by', as: 'recordedBy' });
  }
}

// =========================================================
// 3. Model Initialization
// =========================================================
VisitProcedure.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ ปรับให้เป็น true ตามมาตรฐานการแก้ปัญหาข้อมูลเดิม
    references: {
      model: 'visits',
      key: 'visit_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'services', 
      key: 'id'          
    }
  },
  procedure_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'procedures', 
      key: 'id'            
    }
  },
  diagnosis_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'diagnoses', 
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // 🔥 [Audit] ฟิลด์เก็บตัวตนผู้สั่ง/บันทึกหัตถการ
  recorded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  sequelize,
  tableName: 'visitprocedures', // ✅ ชื่อตารางตามที่คุณระบุ
  timestamps: true,
  underscored: true // บังคับใช้ snake_case (visit_id, recorded_by, created_at)
});

// =========================================================
// 4. Extra Interfaces for Services
// =========================================================
export interface IProcedureInput {
    service: string;
    procedure: string | null;
    diagnosis: string | null;
    notes: string;
    recorded_by?: number; // แนบ ID ผู้บันทึกตอนรับ Input
}
  
export interface IProcedureOutput {
    id?: number;
    visit_id: number;
    notes: string | null;
    service_name: string | null;
    procedure_name: string | null;
    diagnosis_name: string | null;
    recorder_name?: string; // สำหรับส่งชื่อพยาบาล/หมอกลับไปที่หน้าบ้าน
}

export default VisitProcedure;