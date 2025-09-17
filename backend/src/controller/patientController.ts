// src/controller/patientController.ts (เวอร์ชันแก้ไข)

import { Request, Response, NextFunction } from "express";
import db from '../db';
const { Patient, Visit } = db; // ไม่จำเป็นต้อง import sequelize ถ้าไม่ได้ใช้โดยตรง
import { Op } from "sequelize";

// --- ดึงข้อมูลผู้ป่วยทั้งหมด ---
export const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json({
      message: "OK",
      result: patients,
    });
  } catch (err) {
    next(err);
  }
};

// --- ดึงข้อมูลผู้ป่วยตาม ID ---
export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
  }
  try {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "ไม่พบผู้ป่วย" });
    }
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};

// --- ลบผู้ป่วยตาม ID ---
export const deletePatientById = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
  }
  try {
    const affectedRows = await Patient.destroy({ where: { id: id } });
    if (affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ป่วยที่จะลบ" });
    }
    res.status(200).json({
      message: "OK",
      result: `ผู้ป่วยที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
    });
  } catch (err) {
    next(err);
  }
};

// --- สร้างผู้ป่วยใหม่ ---
export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  const newPatientData = req.body;
  if (!newPatientData.first_name || !newPatientData.last_name) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
  }
  try {
    const createdPatient = await Patient.create(newPatientData);
    res.status(201).json({ message: "สร้างผู้ป่วยเรียบร้อยแล้ว", result: createdPatient });
  } catch (err) {
    next(err);
  }
};

// --- อัปเดตข้อมูลผู้ป่วย ---
export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const updatedPatientData = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
  }
  try {
    const [affectedRows] = await Patient.update(updatedPatientData, { where: { id: id } });
    if (affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ป่วยที่จะอัปเดต" });
    }
    res.status(200).json({ message: `ผู้ป่วยที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว` });
  } catch (err) {
    next(err);
  }
};

// --- อัปเดตสถานะผู้ป่วย ---
export const updatePatientStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (isNaN(patientId) || !status) {
      return res.status(400).json({ message: 'Invalid patient ID or status provided.' });
    }
    const [affectedRows] = await Patient.update({ status: status }, { where: { id: patientId } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: `Patient with ID ${patientId} not found.` });
    }
    res.status(200).json({ message: `Patient ${patientId} status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

// --- ดึงข้อมูลสำหรับหน้าทะเบียนผู้ป่วย (เพิ่มการ Log Error) ---
export const getPatientRegistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("--- Running SIMPLIFIED getPatientRegistry query ---");

    const patientsWithVisits = await Patient.findAll({
      include: [{
        model: Visit,
        as: 'visits',
        required: true // ยังคงดึงเฉพาะผู้ป่วยที่มี visit เท่านั้น
      }],
      order: [
        // เรียงลำดับตาม visit ล่าสุด (แต่จะแสดงทุก visit)
        [{ model: Visit, as: 'visits' }, 'visit_datetime', 'DESC']
      ]
    });

    res.status(200).json(patientsWithVisits);

  } catch (error) {
    // --- จุดที่แก้ไข ---
    console.error("🔥🔥 Error executing getPatientRegistry:", error); 
    next(error);
  }
};