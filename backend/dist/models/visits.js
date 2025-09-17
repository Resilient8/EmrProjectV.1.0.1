"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/visits.ts (เวอร์ชันจัดระเบียบ)
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
class Visit extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.Patient, {
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
        this.belongsTo(models.User, {
            foreignKey: 'UserID',
            as: 'recordedBy'
        });
    }
}
Visit.init({
    visit_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patient_id: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'patients',
            key: 'patient_id',
        }
    },
    visit_datetime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    temperature: { type: sequelize_1.DataTypes.DECIMAL(4, 1), allowNull: true },
    pulse: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    respiration: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    blood_pressure: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    height: { type: sequelize_1.DataTypes.DECIMAL(5, 1), allowNull: true },
    weight: { type: sequelize_1.DataTypes.DECIMAL(5, 1), allowNull: true },
    bmi: { type: sequelize_1.DataTypes.DECIMAL(4, 2), allowNull: true },
    waist_circumference: { type: sequelize_1.DataTypes.DECIMAL(5, 1), allowNull: true },
    allergies: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    underlying_diseases: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    UserID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'user_id',
        }
    }
}, {
    sequelize: sequelize_2.default,
    tableName: 'Visits',
    timestamps: false
});
exports.default = Visit;
