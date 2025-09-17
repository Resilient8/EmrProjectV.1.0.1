"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class Pharmacist extends sequelize_1.Model {
    // ฟังก์ชันสำหรับสร้างความสัมพันธ์
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}
Pharmacist.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    license_number: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'pharmacists',
    timestamps: false
});
exports.default = Pharmacist;
