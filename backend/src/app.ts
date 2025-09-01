// ในไฟล์ src/app.ts

import express from "express";
import bodyParser from "body-parser";
import routes from "./routes"; // <<-- Import ตัวรวม routes หลักแค่ตัวเดียว

// สร้าง express application
const app = express();

// --- Middleware ---

// โค้ดใหม่ที่ต้องนำไปใช้แทนที่

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- ส่วนสำคัญที่เพิ่มเข้ามา ---
  // ตรวจสอบว่า request ที่เข้ามาเป็น Preflight (OPTIONS) หรือไม่
  if (req.method === "OPTIONS") {
    // ถ้าใช่ ให้ตอบกลับไปด้วยสถานะ 200 OK ทันที เพื่อบอกเบราว์เซอร์ว่า "อนุญาต"
    return res.sendStatus(200);
  }
  // --- จบส่วนที่เพิ่มเข้ามา ---

  // ถ้าไม่ใช่ OPTIONS request ก็ให้ทำงานต่อไปตามปกติ
  next();
});


// 2. Body Parser Middleware: สำหรับอ่านข้อมูล JSON จาก request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- Routes ---

// 3. ใช้ Routes หลักทั้งหมด โดยให้มี prefix เป็น /api
//    (บรรทัดนี้บรรทัดเดียวพอ ไม่ต้องมี /api/visits แยกอีก)
app.use("/api", routes);

// --- Error Handling ---

// 4. Middleware สำหรับจัดการ Error (ถ้ามี)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send({
    message: "Internal Server Error",
    error: err.message || "Unknown error",
  });
});

export default app;