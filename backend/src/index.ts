// นี่คือโค้ดที่สมบูรณ์และถูกต้องสำหรับไฟล์: backend/src/index.ts

// บรรทัด Test เราลบทิ้งได้เลย
// console.log("--- TESTING: WE ARE IN THE CORRECT INDEX.TS FILE ---");

import express from 'express';
import bodyParser from 'body-parser';
import db from './db/index';
import routes from './routes/index';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") { return res.sendStatus(200); }
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api', routes);

// จุดแก้ไขที่สำคัญที่สุด: เรียกใช้ .sync() จาก db.sequelize
db.sequelize.sync().then(() => {
    console.log("✅ Database and tables have been synced!");
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
}).catch((err: any) => {
    console.error("Unable to sync to the database:", err);
});