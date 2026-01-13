// 📂 backend/controllers/doctors.controller.ts
import { Request, Response } from 'express';
import db from '../db';
import { Op } from 'sequelize';

// Destructure Models - เพิ่ม User เข้ามาเพื่อใช้ Join ดึงชื่อผู้บันทึก (Audit)
const { User, Visit, Patient, VisitSymptom, Symptom, VitalSign } = db;

// ---------------------------------------------------------
// 1. Get All Doctors (ดึงรายชื่อหมอทั้งหมดเพื่อใช้ใน Dropdown หรือการส่งตัว)
// ---------------------------------------------------------
export const getAllDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'Doctor' },
            attributes: ['user_id', 'prefix', 'first_name', 'last_name', 'department', 'avatar_url'],
            order: [['first_name', 'ASC']]
        });

        const formattedDoctors = doctors.map((doc: any) => {
            let avatarUrl = null;
            if (doc.avatar_url) {
                avatarUrl = doc.avatar_url.startsWith('http') 
                    ? doc.avatar_url 
                    : `http://localhost:3000${doc.avatar_url}`;
            }
            return {
                id: doc.user_id,
                name: `${doc.prefix || ''} ${doc.first_name || ''} ${doc.last_name || ''}`.trim(),
                department: doc.department || 'N/A',
                avatar_url: avatarUrl
            };
        });
        
        res.status(200).json(formattedDoctors);
    } catch (error: any) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};

// ---------------------------------------------------------
// 2. Get Patient Queue (ดึงคิวผู้ป่วยที่ส่งมาหาหมอคนนั้นๆ)
// ---------------------------------------------------------
export const getPatientQueue = async (req: Request, res: Response) => {
    try {
        const queryDate = req.query.date as string;
        const doctorId = req.query.doctor_id;

        // กำหนดสถานะที่หมอต้องเห็นในคิว
        const doctorStatuses = [
            'รอพบแพทย์',
            'กำลังรักษา',
            'รักษาเสร็จสิ้น',
            'รอผลแล็บ',
            'รอผลเอ็กซเรย์',
            'รอรับยา',
            'กำลังรับยา',
            'จ่ายยาแล้ว'
        ];

        const visitWhere: any = {
            status: { [Op.in]: doctorStatuses }
        };

        // กรองตาม ID ของหมอที่ได้รับมอบหมาย
        if (doctorId) {
            visitWhere.referral_doctor = String(doctorId); 
        }

        // กรองตามวันที่ (ถ้าเลือกวันที่เฉพาะเจาะจง)
        if (queryDate && queryDate !== 'all') {
            const startDate = new Date(queryDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(queryDate);
            endDate.setHours(23, 59, 59, 999);

            visitWhere.visit_datetime = {
                [Op.between]: [startDate, endDate]
            };
        }

        const patientQueue = await Visit.findAll({
            where: visitWhere,
            include: [
                {
                    model: Patient,
                    attributes: ['id', 'patient_id', 'prefix', 'first_name', 'last_name', 'avatar_url', 'birth_date'],
                    required: true,
                    as: 'Patient',
                },
                {
                    model: VitalSign, // 🔥 เพิ่ม: เพื่อให้หมอเห็นค่า Vitals พื้นฐานในคิวได้เลย
                    as: 'vitalSign',
                    required: false
                },
                {
                    model: User, // 🔥 [Audit] เพิ่ม: เพื่อดูว่าพยาบาลคนไหนเป็นคนเปิดเคส (recorder_id)
                    as: 'recordedBy', 
                    attributes: ['first_name', 'last_name'],
                    required: false
                },
                {
                    model: VisitSymptom,
                    attributes: ['visit_symptom_id', 'details'],
                    required: false,
                    as: 'symptoms',
                    include: [
                        {
                            model: Symptom,
                            as: 'symptom',
                            attributes: ['symptom_name']
                        }
                    ]
                }
            ],
            order: [
                ['status', 'DESC'], // ให้ 'รอพบแพทย์' มาก่อนสถานะอื่น
                ['visit_datetime', 'ASC'] // ใครมาก่อนตรวจก่อน
            ]
        });

        const formattedQueue = patientQueue.map((visitModel: any) => {
            const visit = visitModel.toJSON();
            const patient = visit.Patient || {};
            const symptomsArray = visit.symptoms || [];

            // หาอาการสำคัญเพื่อแสดงในหน้าคิว
            const fallbackComplaint = visit.chief_complaint ||
                (symptomsArray[0]?.symptom?.symptom_name) ||
                (symptomsArray[0]?.details) ||
                '-';

            // จัดการ Avatar URL
            let avatarUrl = null;
            if (patient.avatar_url) {
                let cleanPath = patient.avatar_url.replace(/\\/g, '/');
                if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http')) {
                    cleanPath = '/' + cleanPath;
                }
                avatarUrl = cleanPath.startsWith('http') ? cleanPath : `http://localhost:3000${cleanPath}`;
            }
            
            // คำนวณอายุ
            let age = '-';
            if(patient.birth_date) {
                 const diff = Date.now() - new Date(patient.birth_date).getTime();
                 age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
            }

            const fullName = `${patient.prefix || ''} ${patient.first_name || ''} ${patient.last_name || ''}`.trim();

            return {
                visit_id: visit.visit_id,
                patient_db_id: patient.id,
                patient_id_string: patient.patient_id,
                name: fullName === '' ? 'ไม่ระบุชื่อ' : fullName, 
                avatar_url: avatarUrl,
                age: age,
                symptoms: symptomsArray,
                chief_complaint: fallbackComplaint,
                vitalSigns: visit.vitalSign || null, // ส่งค่า Vitals ไปด้วย
                visit_datetime: visit.visit_datetime,
                status: visit.status,
                // 🔥 [Audit] ส่งชื่อพยาบาลผู้คัดกรองกลับไปด้วย
                screened_by: visit.recordedBy ? `${visit.recordedBy.first_name} ${visit.recordedBy.last_name}` : 'ไม่ระบุ',
                priority: visit.status === 'รอพบแพทย์' ? 1 : 2,
                referral_notes: visit.referral_notes
            };
        });

        res.status(200).json(formattedQueue);

    } catch (error: any) {
        console.error("❌ Error fetching patient queue:", error);
        res.status(500).json({ message: 'Error fetching patient queue', error: error.message });
    }
};

// ---------------------------------------------------------
// 3. Get Available Dates (ดึงวันที่ที่มีคิวการรักษา)
// ---------------------------------------------------------
export const getAvailableDates = async (req: Request, res: Response) => {
    try {
        const doctorId = req.query.doctor_id;

        const whereCondition: any = {
            status: { 
                [Op.in]: ['รอพบแพทย์', 'กำลังรักษา', 'รักษาเสร็จสิ้น', 'รอผลแล็บ', 'รอผลเอ็กซเรย์'] 
            }
        };

        if(doctorId) {
            whereCondition.referral_doctor = String(doctorId);
        }

        const visits = await Visit.findAll({
            where: whereCondition,
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.fn('DATE', db.sequelize.col('visit_datetime'))), 'visit_date']
            ],
            order: [[db.sequelize.col('visit_date'), 'DESC']],
            raw: true
        });

        const dates = visits.map((v: any) => v.visit_date);
        res.status(200).json(dates);

    } catch (error: any) {
        console.error("Error fetching dates:", error);
        res.status(500).json({ message: 'Error fetching dates', error: error.message });
    }
};

// ---------------------------------------------------------
// 4. Get Doctor Active Dates (ดึงวันที่หมอคนนี้มีกิจกรรมการรักษา)
// ---------------------------------------------------------
export const getDoctorActiveDates = async (req: Request, res: Response) => {
    try {
        const doctorId = req.query.doctor_id;

        const whereCondition: any = {
            status: { 
                [Op.in]: ['รอพบแพทย์', 'กำลังรักษา', 'รักษาเสร็จสิ้น', 'รอผลแล็บ', 'รอผลเอ็กซเรย์'] 
            }
        };

        if (doctorId) {
            whereCondition.referral_doctor = String(doctorId);
        }

        const visits = await Visit.findAll({
            where: whereCondition,
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.fn('DATE_FORMAT', db.sequelize.col('visit_datetime'), '%Y-%m-%d')), 'active_date']
            ],
            order: [[db.sequelize.col('active_date'), 'DESC']],
            raw: true
        });

        const dates = visits.map((row: any) => row.active_date);
        
        res.status(200).json(dates);
    } catch (error: any) {
        console.error("Error fetching doctor active dates:", error);
        res.status(500).json([]);
    }
};