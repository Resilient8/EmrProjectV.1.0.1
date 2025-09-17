// src/models/nurses.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface NurseAttributes {
  user_id: number;
  license_number: string | null;
  level: string | null;
}

class Nurse extends Model<NurseAttributes> implements NurseAttributes {
  public user_id!: number;
  public license_number!: string | null;
  public level!: string | null;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Nurse.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'nurses',
  timestamps: false
});

export default Nurse;