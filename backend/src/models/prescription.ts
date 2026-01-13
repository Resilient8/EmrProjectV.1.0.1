import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

// =========================================================
// 1. Definition of Model Attributes (Interface)
// =========================================================
export interface PrescriptionAttributes {
  id: number;
  visit_id: number;
  drug_id: number | null;
  drug_name: string | null;
  quantity: string | null;
  dosage: string | null;
  instruction: string | null;
  is_dispensed: boolean;

  // 🔥 [Audit: Doctor] บันทึกหมอผู้สั่งยาครั้งแรก
  prescribed_by: number | null; 

  // 🔥 [Audit: Pharmacist] บันทึกประวัติกรณีมีการแก้ไขยาที่หน้าห้องยา
  is_edited: boolean;
  edited_by: string | null;   // เก็บเป็นชื่อ หรือ ID (String เพื่อความยืดหยุ่น)
  edit_history: string | null; // รายละเอียดการแก้ เช่น "เปลี่ยนยี่ห้อเนื่องจากยาขาด"
  
  createdAt?: Date;
  updatedAt?: Date;
}

// กำหนดฟิลด์ที่ไม่จำเป็นต้องใส่ตอนสร้าง (id และค่า default)
export interface PrescriptionCreationAttributes extends Optional<PrescriptionAttributes, 'id' | 'is_dispensed' | 'is_edited'> {}

// =========================================================
// 2. Model Class Definition
// =========================================================
class Prescription extends Model<PrescriptionAttributes, PrescriptionCreationAttributes> implements PrescriptionAttributes {
  public id!: number;
  public visit_id!: number;
  public drug_id!: number | null;
  public drug_name!: string | null;
  public quantity!: string | null;
  public dosage!: string | null;
  public instruction!: string | null;
  public is_dispensed!: boolean;

  public prescribed_by!: number | null;
  public is_edited!: boolean;
  public edited_by!: string | null;
  public edit_history!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * สร้างความสัมพันธ์ (Associations)
   */
  static associate(models: any) {
    // 1. เชื่อมกลับไปที่การรักษา (Visit)
    this.belongsTo(models.Visit, { 
      foreignKey: 'visit_id', 
      as: 'visit' 
    });

    // 2. เชื่อมกับข้อมูลยาในสต็อก (Medication)
    this.belongsTo(models.Medication, { 
      foreignKey: 'drug_id', 
      as: 'drugDetail' 
    });
    
    // 3. 🔥 [Audit] เชื่อมไปหา User เพื่อดูว่าหมอคนไหนเป็นคนสั่งยา
    this.belongsTo(models.User, { 
      foreignKey: 'prescribed_by', 
      as: 'prescriber' 
    });
  }
}

// =========================================================
// 3. Model Initialization
// =========================================================
Prescription.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'visits', // ชื่อตารางใน DB
      key: 'visit_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  drug_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'medications',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  drug_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  quantity: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  dosage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  instruction: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_dispensed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  // 🔥 [Audit Field] บันทึก ID หมอ (จากตาราง users)
  prescribed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  // 🔥 [Pharmacist Fields]
  is_edited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  edited_by: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'เก็บชื่อหรือ ID ของเภสัชกรที่แก้ไขรายการ'
  },
  edit_history: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'บันทึกเหตุผลหรือประวัติการแก้ไขยา'
  }
}, {
  sequelize,
  modelName: 'Prescription',
  tableName: 'prescriptions',
  timestamps: true, 
  underscored: true // ใช้ snake_case (prescribed_by, is_dispensed, created_at)
});

export default Prescription;