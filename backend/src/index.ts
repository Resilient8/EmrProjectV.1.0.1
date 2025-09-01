/*import express from 'express';
import bodyParser from 'body-parser';

// ... import อื่นๆ ที่คุณมี

import patientRoutes from './routes/patient.routes'; 
import routes from './routes'; 
import expressApp from "./app"; 


const app = express(); 
const port = process.env.PORT || 3000; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes); 
app.use('/api/patients', patientRoutes); // เพิ่มบรรทัดนี้

app.get('/', (req, res) => {
  res.send('Hello World!');
});

expressApp.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});*/
import app from "./app"; // นำเข้าแอปพลิเคชัน Express จาก app.ts

// ดึงค่าพอร์ตจากตัวแปรสภาพแวดล้อม หรือใช้ 3000 เป็นค่าเริ่มต้น
const port = process.env.PORT || 3000; 

// เริ่มต้นเซิร์ฟเวอร์ Express ให้ listen ที่พอร์ตที่กำหนด
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});