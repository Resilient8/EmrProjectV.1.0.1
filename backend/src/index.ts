import express from 'express';
import cors from 'cors'; 
import db from './db/index';
import path from 'path'; 

// Import Routes ทั้งหมด
import patientRoutes from './routes/patient.route';
import doctorRoutes from './routes/doctor.routes';
import masterDataRoutes from './routes/masterData.route';
import authRoutes from './routes/auth.route';
import visitRoutes from './routes/visits.route';
import prescriptionRoutes from './routes/prescription.routes';
import pharmacistRoutes from './routes/pharmacist.routes';
import medicationRoutes from './routes/medication.route';
import icd10Routes from './routes/icd10.route'; 
import userRoutes from './routes/user.route'; 
import visitDiagnosisRoutes from './routes/visitDiagnosis.route'; // ✅

const app = express();
const port = Number(process.env.PORT) || 3000;

// =========================================================
// 1. CONFIGURATIONS & CORS
// =========================================================
app.use(cors({
    origin: true,
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// =========================================================
// 🔥 2. LOGGING MIDDLEWARE (แบบสะอาดตา)
// =========================================================
app.use((req, res, next) => {
    const silentPaths = ['/masterdata', '/patient-queue', '/details', '/uploads', '/prescriptions/visit'];
    const isSilentPath = silentPaths.some(path => req.url.includes(path));
    const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);

    if (!isSilentPath || isWriteOperation) {
        const timestamp = new Date().toLocaleTimeString('th-TH');
        // ✅ เหลือแค่นี้พอ: บอกเวลา + ยิงไปไหน (สั้นๆ)
        console.log(`\n[${timestamp}] 🚀 ${req.method} -> ${req.url}`);
    }
    next();
});

// =========================================================
// 3. STATIC FILES & ROUTES
// =========================================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/masterdata', masterDataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/pharmacist', pharmacistRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/icd10', icd10Routes); 
app.use('/api/users', userRoutes);
app.use('/api/visit-diagnoses', visitDiagnosisRoutes); // ✅

// =========================================================
// 🔥 4. DATABASE SYNC & SERVER START (ฉบับแก้ไข)
// =========================================================

// ใส่ { alter: true } เพื่อให้ระบบช่วยสร้างตารางที่สัมพันธ์กันได้ถูกต้อง
db.sequelize.sync({ alter: true }).then(() => {
    console.log("\n✅ Database connection: STABLE");
    
    app.listen(port, "0.0.0.0", () => {
        console.log(`🚀 EMR Backend is running on: http://localhost:${port}`);
        console.log(`📂 Uploads directory: ${path.join(__dirname, '../uploads')}`);
        console.log(`---------------------------------------------------\n`);
    });
}).catch((err: any) => {
    // หากติดเรื่องเดิม ให้ลองเปลี่ยนเป็น { force: true } (ระวัง: ข้อมูลเดิมจะหายหมด)
    console.error("❌ Database Sync Error:", err);
});

export default app;