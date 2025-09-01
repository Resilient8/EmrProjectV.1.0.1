"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../db/product"));
// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมด
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.selectAll(); // ดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล
        res.status(200).send({
            message: "OK",
            result: products,
        });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", err); // แสดงข้อผิดพลาดใน console
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
// ฟังก์ชันสำหรับลบสินค้าตาม ID
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10); // แปลง ID จาก string เป็น number
    if (isNaN(id)) { // ตรวจสอบว่า ID เป็นตัวเลขหรือไม่
        return res.status(400).send({
            message: "รูปแบบ ID ไม่ถูกต้อง",
        });
    }
    try {
        yield product_1.default.deleteProductById(id); // ลบสินค้าตาม ID
        res.status(200).send({
            message: "OK",
            result: `สินค้าที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
        });
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการลบสินค้าที่มี ID ${id}:`, err); // แสดงข้อผิดพลาดใน console
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่
const insertProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price } = req.body; // ดึงข้อมูลสินค้าจาก request body
    // ตรวจสอบความถูกต้องของข้อมูล
    if (typeof id !== "number" ||
        typeof name !== "string" ||
        typeof price !== "number") {
        return res.status(400).send({
            message: "ข้อมูลไม่ถูกต้อง",
        });
    }
    try {
        yield product_1.default.insertProduct(id, name, price); // เพิ่มสินค้าใหม่ลงในฐานข้อมูล
        res.status(201).send({
            message: "สร้างสินค้าเรียบร้อยแล้ว",
        });
    }
    catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", err); // แสดงข้อผิดพลาดใน console
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
// ฟังก์ชันสำหรับอัปเดตสินค้าตาม ID
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10); // แปลง ID จาก string เป็น number
    const { name, price } = req.body; // ดึงข้อมูลสินค้าที่อัปเดตแล้วจาก request body
    // ตรวจสอบความถูกต้องของข้อมูล
    if (isNaN(id) || typeof name !== "string" || typeof price !== "number") {
        return res.status(400).send({
            message: "ข้อมูลไม่ถูกต้อง",
        });
    }
    try {
        yield product_1.default.updateProduct(id, name, price); // อัปเดตสินค้าในฐานข้อมูล
        res.status(200).send({
            message: `สินค้าที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว`,
        });
    }
    catch (err) {
        console.error(`เกิดข้อผิดพลาดในการอัปเดตสินค้าที่มี ID ${id}:`, err); // แสดงข้อผิดพลาดใน console
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error",
        });
    }
});
exports.default = { getAll, deleteById, insertProduct, updateProduct };
