import { DataTypes, Model, HasOneGetAssociationMixin } from 'sequelize';
import sequelize from '../db/sequelize'; 
import VitalSign from './vitalSigns';

export interface VisitAttributes {
  visit_id: number; 
  patient_id: string;
  visit_datetime: Date;
  notes?: string;
  UserID?: number;   // ID ผู้ใช้เดิมที่มีในระบบ
  recorder_id?: number | null; // 🔥 [เพิ่มใหม่] ID พยาบาล/เจ้าหน้าที่ ผู้บันทึกเคส (จาก Migration)
  
  // ใน Interface ใช้ชื่อตัวเล็ก (เพื่อให้ Controller เรียกใช้ง่าย)
  present_illness?: string;
  ros_general?: string[];
  ros_head_and_neck?: string[];
  ros_respiratory?: string[];
  ros_cardiovascular?: string[];
  ros_gastrointestinal?: string[];
  ros_skin?: string[];
  
  referral_department?: string;
  referral_doctor?: string;
  referral_notes?: string;

  status?: string; 
}

class Visit extends Model<VisitAttributes> implements VisitAttributes {
  public visit_id!: number; 
  public patient_id!: string;
  public visit_datetime!: Date;
  public notes?: string;
  public UserID?: number;   
  public recorder_id?: number | null; // 🔥 [เพิ่มใหม่]
  
  public present_illness?: string;
  public ros_general?: string[];
  public ros_head_and_neck?: string[];
  public ros_respiratory?: string[];
  public ros_cardiovascular?: string[];
  public ros_gastrointestinal?: string[];
  public ros_skin?: string[];

  public referral_department?: string;
  public referral_doctor?: string;
  public referral_notes?: string;
  public status?: string;

  public getVitalSign!: HasOneGetAssociationMixin<VitalSign>;

  static associate(models: any) {
    this.belongsTo(models.Patient, { foreignKey: 'patient_id', targetKey: 'patient_id', as: 'Patient' });
    
    // เชื่อมโยง UserID เดิม
    this.belongsTo(models.User, { foreignKey: 'UserID', as: 'userAccount' });
    
    // 🔥 [เพิ่มใหม่] เชื่อม recorder_id กับตาราง User เพื่อดึงชื่อพยาบาลผู้บันทึก
    this.belongsTo(models.User, { foreignKey: 'recorder_id', as: 'recordedBy' }); 

    this.hasOne(models.VitalSign, { foreignKey: 'visit_id', as: 'vitalSign' });
    this.hasMany(models.VisitSymptom, { foreignKey: 'visit_id', as: 'symptoms' });
    this.hasMany(models.VisitProcedure, { foreignKey: 'visit_id', as: 'visitProcedures' });
    this.hasMany(models.Prescription, { foreignKey: 'visit_id', as: 'prescriptions' });
    this.hasMany(models.Diagnosis, { foreignKey: 'visit_id', as: 'diagnoses' });
  }
}

Visit.init({
  visit_id: { 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  visit_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  UserID: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'UserID' 
  },
  // 🔥🔥🔥 [เพิ่มใหม่] ฟิลด์บันทึกตัวตนพยาบาล/เจ้าหน้าที่ 🔥🔥🔥
  recorder_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'recorder_id' // ชื่อคอลัมน์ใน DB ที่เราเพิ่ง Migrate
  },
  
  present_illness: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'PresentIllness' 
  },
  ros_general: { 
    type: DataTypes.JSON, 
    allowNull: true,
    field: 'ROS_General' 
  },
  ros_head_and_neck: { 
    type: DataTypes.JSON, 
    allowNull: true,
    field: 'ROS_HeadAndNeck' 
  },
  ros_respiratory: { 
    type: DataTypes.JSON, 
    allowNull: true,
    field: 'ROS_Respiratory'
  },
  ros_cardiovascular: { 
    type: DataTypes.JSON, 
    allowNull: true,
    field: 'ROS_Cardiovascular'
  },
  ros_gastrointestinal: { 
    type: DataTypes.JSON, 
    allowNull: true,
    field: 'ROS_Gastrointestinal'
  },
  ros_skin: { 
    type: DataTypes.JSON, 
    allowNull: true,
    field: 'ROS_Skin'
  },

  referral_department: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  referral_doctor: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  referral_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: true, 
    defaultValue: 'ยังกรอกไม่เสร็จ' 
  }

}, {
  sequelize,
  tableName: 'Visits', 
  timestamps: false
});

export default Visit;