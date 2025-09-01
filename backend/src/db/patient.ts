// src/db/patient.ts
import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "./index";
import { Patient } from "../models/patient";

// ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยทั้งหมดจากฐานข้อมูล
export const getAllPatients = async (): Promise<Patient[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            // ลบ age ออกจาก SELECT
            "SELECT id, prefix, first_name, last_name, address, patient_id, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate, status FROM patient"
        );
        return rows.map(row => ({
            id: row.id,
            prefix: row.prefix,
            firstName: row.first_name,
            lastName: row.last_name,
            // ลบ age ออกจากการ map ข้อมูล
            address: row.address,
            patientId: row.patient_id,
            birthDate: row.birthDate ? new Date(row.birthDate) : null,
            status: row.status,
        }));
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ป่วยตาม ID
export const selectById = async (id: number): Promise<Patient | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            // ลบ age ออกจาก SELECT
            "SELECT id, prefix, first_name, last_name, address, patient_id, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate, status FROM patient WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows.map(row => ({
            id: row.id,
            prefix: row.prefix,
            firstName: row.first_name,
            lastName: row.last_name,
            // ลบ age ออกจากการ map ข้อมูล
            address: row.address,
            patientId: row.patient_id,
            birthDate: row.birthDate ? new Date(row.birthDate) : null,
            status: row.status,
        }))[0] : null;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// ฟังก์ชันสำหรับลบผู้ป่วยตาม ID (โค้ดนี้ถูกต้องอยู่แล้ว)
export const deletePatientById = async (id: number): Promise<void> => {
    try {
        const [result] = await pool.query<ResultSetHeader>(
            "DELETE FROM patient WHERE id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            console.warn(`No patient found with ID: ${id}`);
        }
    } catch (err) {
        console.error("Database deletion error (deletePatientById):", err);
        throw err;
    }
};

// ฟังก์ชันสำหรับเพิ่มผู้ป่วยใหม่
export const insertPatient = async (patient: Patient): Promise<void> => {
    try {
        await pool.query<ResultSetHeader>(
            // ลบ age ออกจาก INSERT
            `INSERT INTO patient (prefix, first_name, last_name, address, patient_id, birth_date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                patient.prefix,
                patient.firstName,
                patient.lastName,
                // ลบ patient.age
                patient.address,
                patient.patientId,
                patient.birthDate,
                patient.status
            ]
        );
    } catch (err) {
        console.error("Database insertion error (insertPatient):", err);
        throw err;
    }
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ป่วยตาม ID
const updatePatient = async (id: number, patient: Patient): Promise<void> => {
    try {
        await pool.query<ResultSetHeader>(
            // ลบ age ออกจาก UPDATE
            `UPDATE patient
             SET prefix = ?,
                 first_name = ?,
                 last_name = ?,
                 address = ?,
                 patient_id = ?,
                 birth_date = ?,
                 status = ?
             WHERE id = ?`,
            [
                patient.prefix,
                patient.firstName,
                patient.lastName,
                // ลบ patient.age
                patient.address,
                patient.patientId,
                patient.birthDate,
                patient.status,
                id
            ]
        );
    } catch (err) {
        console.error("Database update error (updatePatient):", err);
        throw err;
    }
};

// ... โค้ดส่วน export default ...
export default {
    selectAll: getAllPatients,
    selectById,
    deletePatientById,
    insertPatient,
    updatePatient,
    // ฟังก์ชัน insertPatients ก็ต้องลบ age ออกเช่นกันถ้าจะใช้งาน
};