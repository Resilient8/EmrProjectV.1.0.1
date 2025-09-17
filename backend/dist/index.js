"use strict";
// นี่คือโค้ดที่สมบูรณ์และถูกต้องสำหรับไฟล์: backend/src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// บรรทัด Test เราลบทิ้งได้เลย
// console.log("--- TESTING: WE ARE IN THE CORRECT INDEX.TS FILE ---");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./db/index"));
const index_2 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Routes
app.use('/api', index_2.default);
// จุดแก้ไขที่สำคัญที่สุด: เรียกใช้ .sync() จาก db.sequelize
index_1.default.sequelize.sync().then(() => {
    console.log("✅ Database and tables have been synced!");
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error("Unable to sync to the database:", err);
});
