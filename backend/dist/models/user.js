"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class User extends sequelize_1.Model {
    // ฟังก์ชันสำหรับสร้างความสัมพันธ์กับตารางอื่น
    static associate(models) {
        // User หนึ่งคน มีข้อมูล Doctor ได้หนึ่งชุด (One-to-One)
        this.hasOne(models.Doctor, {
            foreignKey: 'user_id',
            as: 'doctorInfo'
        });
        // User หนึ่งคน มีข้อมูล Pharmacist ได้หนึ่งชุด (One-to-One)
        this.hasOne(models.Pharmacist, {
            foreignKey: 'user_id',
            as: 'pharmacistInfo'
        });
    }
}
User.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    prefix: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('Doctor', 'Nurse', 'Admin', 'Pharmacist'),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'users',
    timestamps: false
});
exports.default = User;
