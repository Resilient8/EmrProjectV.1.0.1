"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
// สร้าง express application
const app = (0, express_1.default)();
// --- Middleware ---
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
// --- Routes ---
app.use("/api", routes_1.default);
// --- Error Handling ---
app.use((err, req, res, next) => {
    // 👇 แก้ไขจาก err.stack เป็น err เพื่อแสดงรายละเอียดของ Error ทั้งหมด
    console.error(err);
    res.status(500).send({
        message: "Internal Server Error",
        error: err.message || "Unknown error",
    });
});
exports.default = app;
