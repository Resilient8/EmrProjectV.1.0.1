import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface CategoryAttributes {
  category_id: number;
  category_name: string;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public category_id!: number;
  public category_name!: string;

  // ===== เปิดใช้งานส่วนนี้ =====
  static associate(models: any) {
    // บอกว่า 1 Category "มีได้หลาย" (hasMany) Products
    this.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products'
    });
  }
}

Category.init({
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  category_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'categories',
  timestamps: false
});

export default Category;