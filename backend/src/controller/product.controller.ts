import { Request, Response } from "express";
import db from '../db'; // 1. แก้ไขการ import ให้ดึงจาก db/index.ts
const { Product } = db; // ดึง Model ที่ชื่อ Product ออกมาใช้งาน

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมด
const getAll = async (req: Request, res: Response) => {
  try {
    // 2. เปลี่ยนจาก selectAll() เป็น findAll() ของ Sequelize
    const products = await Product.findAll(); 
    res.status(200).send({
      message: "OK",
      result: products,
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// ฟังก์ชันสำหรับลบสินค้าตาม ID
const deleteById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({
      message: "รูปแบบ ID ไม่ถูกต้อง",
    });
  }

  try {
    // 2. เปลี่ยนจาก deleteProductById(id) เป็น destroy({ where: ... }) ของ Sequelize
    const deletedRows = await Product.destroy({ where: { id: id } });
    
    if (deletedRows === 0) {
      return res.status(404).send({ message: `ไม่พบสินค้าที่มี ID ${id}` });
    }

    res.status(200).send({
      message: "OK",
      result: `สินค้าที่มี ID ${id} ถูกลบเรียบร้อยแล้ว`,
    });
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการลบสินค้าที่มี ID ${id}:`, err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// ฟังก์ชันสำหรับเพิ่มสินค้าใหม่
const insertProduct = async (req: Request, res: Response) => {
  try {
    const newProductData = req.body; // รับข้อมูลสินค้าจาก request body

    // 2. เปลี่ยนจาก insertProduct(...) เป็น create(...) ของ Sequelize
    const newProduct = await Product.create(newProductData); 

    res.status(201).send({
      message: "สร้างสินค้าเรียบร้อยแล้ว",
      result: newProduct
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// ฟังก์ชันสำหรับอัปเดตสินค้าตาม ID
const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updatedData = req.body; 

  if (isNaN(id)) {
    return res.status(400).send({ message: "รูปแบบ ID ไม่ถูกต้อง" });
  }

  try {
    // 2. เปลี่ยนจาก updateProduct(...) เป็น update(...) ของ Sequelize
    const [updatedRows] = await Product.update(updatedData, { where: { id: id } });

    if (updatedRows === 0) {
      return res.status(404).send({ message: `ไม่พบสินค้าที่มี ID ${id} ที่จะอัปเดต` });
    }

    res.status(200).send({
      message: `สินค้าที่มี ID ${id} ถูกอัปเดตเรียบร้อยแล้ว`,
    });
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการอัปเดตสินค้าที่มี ID ${id}:`, err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export default { getAll, deleteById, insertProduct, updateProduct };