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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db"); // <<-- เปลี่ยน promisePool เป็น pool เพื่อให้ตรงกับ export ใน db.ts
// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล
const selectAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ใช้ pool เพื่อ query ฐานข้อมูล (SELECT * FROM product)
        const [rows] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "SELECT * FROM product");
        return rows; // ส่งคืนผลลัพธ์ที่ได้จากการ query (rows)
    }
    catch (err) {
        // ในกรณีที่เกิดข้อผิดพลาดในการ query
        console.error("Database query error:", err);
        throw err; // ส่งต่อ error เพื่อให้ส่วนอื่นๆ ของโปรแกรมสามารถจัดการได้
    }
});
// ฟังก์ชันสำหรับลบสินค้าตาม ID
const deleteProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Attempting to delete product with ID: ${id}`); // แสดง log เพื่อบอกว่ากำลังพยายามลบสินค้า
        const [result] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "DELETE FROM product WHERE id = ?", // คำสั่ง SQL สำหรับลบสินค้าตาม ID
        [id]);
        console.log("Delete result:", result); // แสดง log ผลลัพธ์การลบ
        // ตรวจสอบว่ามีการลบสินค้าหรือไม่ ถ้า affectedRows เป็น 0 แสดงว่าไม่พบสินค้าที่มี ID นั้น
        if (result.affectedRows === 0) {
            console.warn(`No product found with ID: ${id}`);
        }
    }
    catch (err) {
        // ในกรณีที่เกิดข้อผิดพลาดในการลบ
        console.error("Database deletion error:", err);
        throw err;
    }
});
// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่
const insertProduct = (id, name, price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "INSERT INTO product (id, name, price) VALUES (?, ?, ?)", // คำสั่ง SQL สำหรับเพิ่มสินค้าใหม่
        [id, name, price]);
        console.log("Insert result:", result); // แสดง log ผลลัพธ์การเพิ่ม
        // ตรวจสอบว่ามีการเพิ่มสินค้าหรือไม่ ถ้า affectedRows เป็น 0 แสดงว่าไม่มีการเพิ่มแถวใหม่
        if (result.affectedRows === 0) {
            console.warn("Insert operation did not affect any rows");
        }
    }
    catch (err) {
        // ในกรณีที่เกิดข้อผิดพลาดในการเพิ่ม
        console.error("Database insertion error:", err);
        throw err;
    }
});
// ฟังก์ชันสำหรับอัปเดตสินค้าตาม ID
const updateProduct = (id, name, price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield db_1.pool.query(// <<-- เปลี่ยน promisePool เป็น pool
        "UPDATE product SET name = ?, price = ? WHERE id = ?", // คำสั่ง SQL สำหรับอัปเดตสินค้าตาม ID
        [name, price, id]);
        console.log("Update result:", result); // แสดง log ผลลัพธ์การอัปเดต
        // ตรวจสอบว่ามีการอัปเดตสินค้าหรือไม่ ถ้า affectedRows เป็น 0 แสดงว่าไม่พบสินค้าที่มี ID นั้น
        if (result.affectedRows === 0) {
            console.warn(`No product found with ID: ${id}`);
        }
    }
    catch (err) {
        // ในกรณีที่เกิดข้อผิดพลาดในการอัปเดต
        console.error("Database update error:", err);
        throw err;
    }
});
// export ฟังก์ชันทั้งหมดเพื่อให้ส่วนอื่นๆ ของแอปพลิเคชันสามารถใช้งานได้
exports.default = { selectAll, deleteProductById, insertProduct, updateProduct };
