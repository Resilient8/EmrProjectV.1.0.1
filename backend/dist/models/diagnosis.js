"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class Diagnosis extends sequelize_1.Model {
}
Diagnosis.init({
    diagnosis_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    diagnosis_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'diagnosis', // ชื่อตารางในฐานข้อมูล
    timestamps: false
});
exports.default = Diagnosis;
