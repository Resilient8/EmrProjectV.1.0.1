"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class Doctor extends sequelize_1.Model {
    // ฟังก์ชันสำหรับสร้างความสัมพันธ์กับตารางอื่น
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' });
        this.belongsTo(models.Department, { foreignKey: 'department_id' });
    }
}
Doctor.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    specialization: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    license_number: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    department_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'departments', // ชื่อตาราง departments
            key: 'id',
        }
    }
}, {
    sequelize: sequelize_2.default,
    tableName: 'doctors',
    timestamps: false
});
exports.default = Doctor;
