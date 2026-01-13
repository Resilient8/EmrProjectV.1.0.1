import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface ProductAttributes {
  id: number;
  product_name: string;
  price: number;
  category_id: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public product_name!: string;
  public price!: number;
  public category_id!: number;

  static associate(models: any) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  }
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id', // 👈 ต้องแก้เป็น 'id' ครับ (เพราะมันชี้ไปที่ PK ของตาราง Categories)
    }
  }
}, {
  sequelize,
  tableName: 'products',
  timestamps: false
});

export default Product;