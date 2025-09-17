"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class Department extends sequelize_1.Model {
    // ฟังก์ชันสำหรับสร้างความสัมพันธ์
    static associate(models) {
        this.hasMany(models.Doctor, { foreignKey: 'department_id' });
    }
}
Department.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'departments',
    timestamps: false
});
exports.default = Department;
