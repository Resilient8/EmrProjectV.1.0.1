"use strict";
// src/models/patient.ts (กลับสู่เวอร์ชันดั้งเดิม)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class Patient extends sequelize_1.Model {
    static associate(models) {
        this.hasMany(models.Visit, {
            foreignKey: 'patient_id',
            sourceKey: 'patient_id', // <-- กลับมาเป็น patient_id
            as: 'visits'
        });
    }
}
Patient.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    prefix: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    patient_id: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    birth_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    }
}, {
    sequelize: sequelize_2.default,
    tableName: 'patients',
    timestamps: false
});
exports.default = Patient;
