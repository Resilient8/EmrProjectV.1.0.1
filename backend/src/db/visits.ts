import { RowDataPacket, ResultSetHeader } from "mysql2"; // นำเข้า types ที่จำเป็นจาก mysql2
import { pool } from "../config/db"; // <<-- เปลี่ยน promisePool เป็น pool เพื่อให้ตรงกับ export ใน db.ts
import { Visit } from "../models/visits";

// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมทั้งหมด
export const getAllVisits = async (): Promise<Visit[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>( // <<-- เปลี่ยน promisePool เป็น pool
            "SELECT * FROM Visits" // ใช้ชื่อตาราง Visits ตามที่คุณตั้งไว้
        );
        return rows.map(row => ({
            visit_id: row.visit_id,
            patient_id: row.patient_id,
            visit_datetime: row.visit_datetime,
            temperature: row.temperature,
            pulse: row.pulse,
            respiration: row.respiration,
            blood_pressure: row.blood_pressure,
            height: row.height,
            weight: row.weight,
            bmi: row.bmi,
            waist_circumference: row.waist_circumference,
            allergies: row.allergies,
            underlying_diseases: row.underlying_diseases,
            symptoms: row.symptoms,
            notes: row.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณมีในตาราง visits
        }));
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมทั้งหมด:", err);
        throw err;
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมตาม ID
export const selectVisitById = async (id: number): Promise<Visit | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>( // <<-- เปลี่ยน promisePool เป็น pool
            "SELECT * FROM Visits WHERE visit_id = ?",
            [id]
        );
        return rows.length > 0 ? rows.map(row => ({
            visit_id: row.visit_id,
            patient_id: row.patient_id,
            visit_datetime: row.visit_datetime,
            temperature: row.temperature,
            pulse: row.pulse,
            respiration: row.respiration,
            blood_pressure: row.blood_pressure,
            height: row.height,
            weight: row.weight,
            bmi: row.bmi,
            waist_circumference: row.waist_circumference,
            allergies: row.allergies,
            underlying_diseases: row.underlying_diseases,
            symptoms: row.symptoms,
            notes: row.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณมีในตาราง visits
        }))[0] : null;
    } catch (err) {
        console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมที่มี ID ${id}:`, err);
        throw err;
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลการเยี่ยมของผู้ป่วยตาม patient_id
export const selectVisitsByPatientId = async (patientId: string): Promise<Visit[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>( // <<-- เปลี่ยน promisePool เป็น pool
            "SELECT * FROM Visits WHERE patient_id = ?",
            [patientId]
        );
        return rows.map(row => ({
            visit_id: row.visit_id,
            patient_id: row.patient_id,
            visit_datetime: row.visit_datetime,
            temperature: row.temperature,
            pulse: row.pulse,
            respiration: row.respiration,
            blood_pressure: row.blood_pressure,
            height: row.height,
            weight: row.weight,
            bmi: row.bmi,
            waist_circumference: row.waist_circumference,
            allergies: row.allergies,
            underlying_diseases: row.underlying_diseases,
            symptoms: row.symptoms,
            notes: row.notes,
            // เพิ่ม Fields อื่นๆ ที่คุณมีในตาราง visits
        }));
    } catch (err) {
        console.error(`เกิดข้อผิดพลาดในการดึงข้อมูลการเยี่ยมของผู้ป่วยที่มี ID ${patientId}:`, err);
        throw err;
    }
};

// ฟังก์ชันสำหรับลบข้อมูลการเยี่ยมตาม ID
export const deleteVisitById = async (id: number): Promise<void> => {
    try {
        const [result] = await pool.query<ResultSetHeader>( // <<-- เปลี่ยน promisePool เป็น pool
            "DELETE FROM Visits WHERE visit_id = ?",
            [id]
        );
        if ((result as ResultSetHeader).affectedRows === 0) {
            console.warn(`ไม่พบข้อมูลการเยี่ยมที่มี ID: ${id}`);
        }
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูลการเยี่ยม:", err);
        throw err;
    }
};

// ฟังก์ชันสำหรับเพิ่มข้อมูลการเยี่ยมใหม่
export const insertVisit = async (visit: Visit): Promise<void> => {
    try {
        const [result] = await pool.query<ResultSetHeader>( // <<-- เปลี่ยน promisePool เป็น pool
            `INSERT INTO Visits (patient_id, visit_datetime, temperature, pulse, respiration, blood_pressure, height, weight, bmi, waist_circumference, allergies, underlying_diseases, symptoms, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                visit.patient_id,
                visit.visit_datetime,
                visit.temperature,
                visit.pulse,
                visit.respiration,
                visit.blood_pressure,
                visit.height,
                visit.weight,
                visit.bmi,
                visit.waist_circumference,
                visit.allergies,
                visit.underlying_diseases,
                visit.symptoms,
                visit.notes,
                // เพิ่ม Fields อื่นๆ ที่คุณต้องการ Insert
            ]
        );
        if ((result as ResultSetHeader).affectedRows === 0) {
            console.warn("การเพิ่มข้อมูลการเยี่ยมไม่สำเร็จ");
        }
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลการเยี่ยม:", err);
        throw err;
    }
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลการเยี่ยมตาม ID
export const updateVisit = async (id: number, visit: Visit): Promise<void> => {
    try {
        const [result] = await pool.query<ResultSetHeader>( // <<-- เปลี่ยน promisePool เป็น pool
            `UPDATE Visits
            SET patient_id = ?,
                visit_datetime = ?,
                temperature = ?,
                pulse = ?,
                respiration = ?,
                blood_pressure = ?,
                height = ?,
                weight = ?,
                bmi = ?,
                waist_circumference = ?,
                allergies = ?,
                underlying_diseases = ?,
                symptoms = ?,
                notes = ?
            WHERE visit_id = ?`,
            [
                visit.patient_id,
                visit.visit_datetime,
                visit.temperature,
                visit.pulse,
                visit.respiration,
                visit.blood_pressure,
                visit.height,
                visit.weight,
                visit.bmi,
                visit.waist_circumference,
                visit.allergies,
                visit.underlying_diseases,
                visit.symptoms,
                visit.notes,
                id,
                // เพิ่ม Fields อื่นๆ ที่คุณต้องการ Update
            ]
        );
        if ((result as ResultSetHeader).affectedRows === 0) {
            console.warn(`ไม่พบข้อมูลการเยี่ยมที่มี ID: ${id} สำหรับการอัปเดต`);
        }
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลการเยี่ยม:", err);
        throw err;
    }
};

export default {
    selectAll: getAllVisits,
    selectVisitById,
    selectVisitsByPatientId,
    deleteVisitById,
    insertVisit,
    updateVisit,
};