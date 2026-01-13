// File: src/services/auth.service.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // เช็ค Port ให้ถูกต้อง
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
      phone: userData.phone?.replace(/-/g, ''), // ลบขีดออกจากเบอร์โทร
      password: userData.password,
      role: userData.userType,
      specialization: userData.licenseNumber || null,
      workplace: userData.workplace || null,
      department: userData.department || null,
      position: userData.position || null
    };

    return apiClient.post('/auth/register', dataToSend);
  }

  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  }

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

// ✅ บรรทัดนี้สำคัญมาก ห้ามลบ!
export default new AuthService();