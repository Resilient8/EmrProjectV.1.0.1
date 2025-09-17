import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

// สร้าง express application
const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- Routes ---
app.use("/api", routes);

// --- Error Handling ---
app.use((err: any, req: any, res: any, next: any) => {
  // 👇 แก้ไขจาก err.stack เป็น err เพื่อแสดงรายละเอียดของ Error ทั้งหมด
  console.error(err);
  res.status(500).send({
    message: "Internal Server Error",
    error: err.message || "Unknown error",
  });
});

export default app;