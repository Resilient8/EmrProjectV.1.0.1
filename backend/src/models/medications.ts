import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';

export interface MedicationAttributes {
  id: number;
  medication_code: string; // รหัสยา (เช่น DRUG001)
  generic_name: string;    // ชื่อสามัญ (เช่น Paracetamol)
  trade_name?: string;     // ชื่อการค้า (เช่น Tylenol)
  
  dosage?: string;         // 🔥 เพิ่ม: ขนาด (เช่น 500 mg)
  dosage_form?: string;    // รูปแบบ (เช่น Tablet, Syrup)
  unit?: string;           // 🔥 เพิ่ม: หน่วยนับ (เช่น เม็ด, ขวด)
  
  price: number;
  stock_quantity: number;
  
  instructions?: string;   // 🔥 เพิ่ม: วิธีใช้มาตรฐาน
  is_active: boolean;      // 🔥 เพิ่ม: สถานะเปิด/ปิดใช้งาน
}

class Medication extends Model<MedicationAttributes> implements MedicationAttributes {
  public id!: number;
  public medication_code!: string;
  public generic_name!: string;
  public trade_name!: string;
  
  public dosage!: string;
  public dosage_form!: string;
  public unit!: string;
  
  public price!: number;
  public stock_quantity!: number;
  
  public instructions!: string;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  static associate(models: any) {
    // define association here if needed
    // ตัวอย่าง: this.hasMany(models.PrescriptionItem, ...)
  }
}

Medication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  medication_code: {
    type: DataTypes.STRING,
    allowNull: true, // หรือ false ถ้าบังคับต้องมีรหัส
    unique: true     // รหัสยาไม่ควรซ้ำกัน
  },
  generic_name: {
    type: DataTypes.STRING,
    allowNull: false // ชื่อสามัญจำเป็นต้องมี
  },
  trade_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // --- เพิ่มเติม ---
  dosage: {
    type: DataTypes.STRING, // e.g., "500 mg"
    allowNull: true
  },
  dosage_form: {
    type: DataTypes.STRING, // e.g., "Tablet"
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING, // e.g., "เม็ด"
    allowNull: true
  },
  // ---------------
  price: {
    type: DataTypes.DECIMAL(10, 2), // 🔥 ใช้ DECIMAL ดีกว่า FLOAT สำหรับเงิน
    defaultValue: 0
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  instructions: {
    type: DataTypes.TEXT, // เก็บข้อความยาวๆ ได้
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // สร้างใหม่ให้ active เป็น default
  }
}, {
  sequelize,
  modelName: 'Medication',
  tableName: 'medications', // ชื่อตารางใน DB
  underscored: true,        // ใช้ created_at แทน createdAt ใน DB
  timestamps: true          // 🔥 ควรเปิดเป็น true เพื่อเก็บประวัติการสร้าง/แก้ไข
});

export default Medication;