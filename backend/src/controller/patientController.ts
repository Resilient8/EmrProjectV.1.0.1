import { Request, Response, NextFunction } from "express";
import pool from '../db';
import { Patient } from "../models/patient";
import patientDB from "../db/patient";

// ... (ฟังก์ชันอื่นๆ ของคุณ getAllPatients, createPatient, etc. ไม่ต้องแก้ไข) ...
const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients: Patient[] = await patientDB.selectAll();
    res.status(200).json({
      message: "OK",
      result: patients,
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย:", err);
    res.status(500).json({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

const getPatientById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
  }
  try {
    const patient = await patientDB.selectById(id); 
    if (!patient) {
      return res.status(404).json({ message: "ไม่พบผู้ป่วย" });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วยที่มี ID ${id}:`, err);
    res.status(500).json({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

const deletePatientById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "รูปแบบ ID ไม่ถูกต้อง" });
  }
  try {
    await patientDB.deletePatientById(id);
    res.status(200).json({
      message: "OK",
      result: `ผู้ป่วยที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
    });
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการลบผู้ป่วยที่มี ID ${id}:`, err);
    res.status(500).json({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

const createPatient = async (req: Request, res: Response) => {
  const newPatient: Patient = req.body;
  if (!newPatient.firstName || !newPatient.lastName) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
  }
  try {
    await patientDB.insertPatient(newPatient);
    res.status(201).json({ message: "สร้างผู้ป่วยเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย:", err);
    res.status(500).json({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

const updatePatient = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedPatient: Patient = req.body;
  if (isNaN(id) || !updatedPatient.firstName || !updatedPatient.lastName) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
  }
  try {
    await patientDB.updatePatient(id, updatedPatient);
    res.status(200).json({ message: `ผู้ป่วยที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว` });
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการอัปเดตผู้ป่วยที่มี ID ${id}:`, err);
    res.status(500).json({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const updatePatientStatus = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (isNaN(patientId) || !status) {
      return res.status(400).json({ message: 'Invalid patient ID or status provided.' });
    }
    const [result]: any = await pool.query(
      'UPDATE patient SET status = ? WHERE id = ?',
      [status, patientId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Patient with ID ${patientId} not found.` });
    }
    res.status(200).json({ message: `Patient ${patientId} status updated to ${status}` });
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};


/**
 * ดึงข้อมูลสำหรับหน้าทะเบียนผู้ป่วยโดยเฉพาะ
 */
export const getPatientRegistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // --- FIX: เปลี่ยนชื่อตารางจาก visit เป็น Visits ---
    const query = `
      SELECT
          p.id,
          p.prefix,
          p.first_name,
          p.last_name,
          p.patient_id,
          p.status,
          p.birth_date,
          v.visit_datetime AS arrivalTime,
          v.visit_id
      FROM
          patient p
      JOIN
          Visits v ON p.patient_id = v.patient_id
      WHERE
          v.visit_datetime = (
              SELECT MAX(v2.visit_datetime)
              FROM Visits v2
              WHERE v2.patient_id = p.patient_id
          )
      ORDER BY
          v.visit_datetime DESC;
    `;

    const [rows] = await pool.query(query);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error fetching patient registry:', error);
    // ส่งต่อ error ไปให้ middleware จัดการ
    next(error);
  }
};


export default { 
  getAllPatients,
  getPatientById,
  deletePatientById,
  createPatient,
  updatePatient,
  updatePatientStatus,
  getPatientRegistry
};
