import { Sequelize } from 'sequelize';

// 1. กำหนด Environment (ถ้าไม่บอก ให้ถือว่าเป็น development)
const env = process.env.NODE_ENV || 'development';

// 2. ดึงค่า Config จากไฟล์ config.json ที่เราแก้ไปแล้ว
// (ย้อนกลับไป 2 โฟลเดอร์: src/db -> src -> backend -> config)
const config = require('../../config/config.json')[env];

// 3. สร้าง Instance โดยใช้ค่าจาก config.json (ที่มีรหัสผ่าน root)
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect, // 'mysql'
    logging: config.logging, // false
    port: 3306
  }
);

export default sequelize;