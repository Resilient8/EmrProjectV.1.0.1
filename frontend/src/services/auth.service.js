import axios from 'axios';

// ตั้งค่า URL หลักให้ชี้ไปที่ Backend Port 3000
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

class AuthService {

  // ฟังก์ชันลงทะเบียน (Register)
  register(userData) {
    // แปลงข้อมูลให้ตรงกับที่ Backend ต้องการ
    const dataToSend = {
      prefix: userData.prefix,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone?.replace(/-/g, ''), // ตัดขีดออก
      password: userData.password,
      role: userData.userType,
      specialization: userData.licenseNumber || null,
      workplace: userData.workplace || null,
      department: userData.department || null,
      position: userData.position || null
    };

    // ยิงไปที่ /auth/register (ตามที่เราทำใน Backend)
    return apiClient.post('/auth/register', dataToSend);
  }

  // ฟังก์ชันเข้าสู่ระบบ (Login)
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  }

  // ฟังก์ชันเก็บข้อมูล User ลงเครื่อง
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

// 🔥 สำคัญมาก: ต้อง export default new ... เพื่อให้หน้า Vue เรียกใช้ได้ทันที
export default new AuthService();
