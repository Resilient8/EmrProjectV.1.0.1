// src/models/medications.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface MedicationAttributes {
  product_id: number;
  generic_name: string | null;
  dosage_form: string | null; // รูปแบบยา (เม็ด, น้ำ)
  strength: string | null;    // ความแรง (500mg)
  contraindications: string | null; // ข้อห้ามใช้
}

class Medication extends Model<MedicationAttributes> implements MedicationAttributes {
  public product_id!: number;
  public generic_name!: string | null;
  public dosage_form!: string | null;
  public strength!: string | null;
  public contraindications!: string | null;

  static associate(models: any) {
    // สร้างความสัมพันธ์แบบ One-to-One กับตาราง products
    this.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

Medication.init({
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  generic_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dosage_form: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contraindications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'medications',
  timestamps: false
});

export default Medication;