"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/visitProcedures.ts (เวอร์ชันสมบูรณ์)
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
// *** ส่วนของ Sequelize Model ที่เพิ่มเข้ามา ***
class VisitProcedure extends sequelize_1.Model {
}
VisitProcedure.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    visit_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    service_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    procedure_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    diagnosis_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'VisitProcedures',
    timestamps: false
});
exports.default = VisitProcedure;
