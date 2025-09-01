import { Request, Response } from "express"; 
import product from "../db/product"; 

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมด
const getAll = async (req: Request, res: Response) => {
  try {
    const products = await product.selectAll(); // ดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล
    res.status(200).send({ // ส่งผลลัพธ์กลับไปพร้อมสถานะ 200 (OK)
      message: "OK", 
      result: products, 
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", err); // แสดงข้อผิดพลาดใน console
    res.status(500).send({ // ส่งข้อความผิดพลาดกลับไปพร้อมสถานะ 500 (Internal Server Error)
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error", 
    });
  }
};

// ฟังก์ชันสำหรับลบสินค้าตาม ID
const deleteById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10); // แปลง ID จาก string เป็น number

  if (isNaN(id)) { // ตรวจสอบว่า ID เป็นตัวเลขหรือไม่
    return res.status(400).send({ // ถ้าไม่ใช่ ส่งข้อความผิดพลาดพร้อมสถานะ 400 (Bad Request)
      message: "รูปแบบ ID ไม่ถูกต้อง",
    });
  }

  try {
    await product.deleteProductById(id); // ลบสินค้าตาม ID
    res.status(200).send({ // ส่งข้อความสำเร็จพร้อมสถานะ 200 (OK)
      message: "OK",
      result: `สินค้าที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
    });
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการลบสินค้าที่มี ID ${id}:`, err); // แสดงข้อผิดพลาดใน console
    res.status(500).send({ // ส่งข้อความผิดพลาดกลับไปพร้อมสถานะ 500
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่
const insertProduct = async (req: Request, res: Response) => {
  const { id, name, price } = req.body; // ดึงข้อมูลสินค้าจาก request body

  // ตรวจสอบความถูกต้องของข้อมูล
  if (
    typeof id !== "number" ||
    typeof name !== "string" ||
    typeof price !== "number"
  ) {
    return res.status(400).send({ // ถ้าข้อมูลไม่ถูกต้อง ส่งข้อความผิดพลาดพร้อมสถานะ 400
      message: "ข้อมูลไม่ถูกต้อง",
    });
  }

  try {
    await product.insertProduct(id, name, price); // เพิ่มสินค้าใหม่ลงในฐานข้อมูล
    res.status(201).send({ // ส่งข้อความสำเร็จพร้อมสถานะ 201 (Created)
      message: "สร้างสินค้าเรียบร้อยแล้ว",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", err); // แสดงข้อผิดพลาดใน console
    res.status(500).send({ // ส่งข้อความผิดพลาดกลับไปพร้อมสถานะ 500
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// ฟังก์ชันสำหรับอัปเดตสินค้าตาม ID
const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10); // แปลง ID จาก string เป็น number
  const { name, price } = req.body; // ดึงข้อมูลสินค้าที่อัปเดตแล้วจาก request body

  // ตรวจสอบความถูกต้องของข้อมูล
  if (isNaN(id) || typeof name !== "string" || typeof price !== "number") {
    return res.status(400).send({ // ถ้าข้อมูลไม่ถูกต้อง ส่งข้อความผิดพลาดพร้อมสถานะ 400
      message: "ข้อมูลไม่ถูกต้อง",
    });
  }

  try {
    await product.updateProduct(id, name, price); // อัปเดตสินค้าในฐานข้อมูล
    res.status(200).send({ // ส่งข้อความสำเร็จพร้อมสถานะ 200 (OK)
      message: `สินค้าที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว`,
    });
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการอัปเดตสินค้าที่มี ID ${id}:`, err); // แสดงข้อผิดพลาดใน console
    res.status(500).send({ // ส่งข้อความผิดพลาดกลับไปพร้อมสถานะ 500
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export default { getAll, deleteById, insertProduct, updateProduct };