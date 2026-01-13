import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

// =========================================================
// 1. Definition of Model Attributes (Interface)
// =========================================================
export interface DiagnosisAttributes {
  id: number;
  visit_id: number | null;    // ✅ เชื่อมกับ Visit (allowNull: true ตาม Migration ล่าสุด)
  diagnosis_code: string | null; 
  diagnosis_name: string;
  doctor_id: number | null;   // 🔥 [Audit] ID แพทย์ผู้ทำการวินิจฉัย
  createdAt?: Date;
  updatedAt?: Date;
}

// กำหนดฟิลด์ที่ไม่จำเป็นต้องใส่ตอนสร้าง (เช่น id ที่เป็น Auto Increment)
export interface DiagnosisCreationAttributes extends Optional<DiagnosisAttributes, 'id'> {}

// =========================================================
// 2. Model Class Definition
// =========================================================
class Diagnosis extends Model<DiagnosisAttributes, DiagnosisCreationAttributes> implements DiagnosisAttributes {
  public id!: number;
  public visit_id!: number | null;
  public diagnosis_code!: string | null;
  public diagnosis_name!: string;
  public doctor_id!: number | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * สร้างความสัมพันธ์ (Associations) ระหว่างตาราง
   */
  static associate(models: any) {
    // 1. เชื่อมกลับไปที่ตาราง Visit (วินิจฉัยนี้เป็นของเคสไหน)
    this.belongsTo(models.Visit, { 
        foreignKey: 'visit_id', 
        as: 'visit' 
    });
    
    // 2. 🔥 [Audit] เชื่อมไปที่ User เพื่อดึงชื่อหมอผู้บันทึก (ใครเป็นคนวินิจฉัย)
    this.belongsTo(models.User, { 
        foreignKey: 'doctor_id', 
        as: 'diagnosedBy' 
    });
  }
}

// =========================================================
// 3. Model Initialization
// =========================================================
Diagnosis.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ ตั้งเป็น true เพื่อให้รันผ่านตามโครงสร้าง DB ปัจจุบัน
    references: {
      model: 'visits', // ชื่อตารางใน DB (snake_case)
      key: 'visit_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  diagnosis_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'รหัส ICD-10',
  },
  diagnosis_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'ชื่อโรคหรือรายละเอียดการวินิจฉัย',
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ อนุญาตให้เป็น null ได้เผื่อกรณีข้อมูลเก่า
    references: {
      model: 'users', // ชื่อตารางผู้ใช้งาน
      key: 'user_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  sequelize,
  tableName: 'diagnoses', // ชื่อตารางต้องตรงกับในฐานข้อมูล
  timestamps: true,       // บันทึก createdAt และ updatedAt อัตโนมัติ
  underscored: true,      // บังคับใช้ snake_case (visit_id, doctor_id, created_at)
});

export default Diagnosis;