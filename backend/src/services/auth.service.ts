// File: src/services/auth.service.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

class AuthService {
  
  register(userData) {
    const dataToSend = {
      prefix: userData.prefix,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone?.replace(/-/g, ''),
      password: userData.password,
      role: userData.userType,
      specialization: userData.licenseNumber || null
    };
    return apiClient.post('/auth/register', dataToSend);
  }

  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  }

  // **เพิ่ม:** ฟังก์ชันสำหรับบันทึกข้อมูลผู้ใช้หลัง Login สำเร็จ
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // **เพิ่ม:** ฟังก์ชันสำหรับออกจากระบบ
  logout() {
    localStorage.removeItem('user');
  }

  // **เพิ่ม:** ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน (สำหรับหน้า Dashboard)
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

export default new AuthService();