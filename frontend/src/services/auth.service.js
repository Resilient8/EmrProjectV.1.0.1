import axios from 'axios';

// URL ของ API Server ของคุณ
const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  /**
   * เมธอดสำหรับส่งข้อมูลไปลงทะเบียนผู้ใช้ใหม่
   * @param {object} userData - ข้อมูลผู้ใช้จากฟอร์มลงทะเบียน
   */
  static async register(userData) {
    const response = await axios.post(API_URL + 'signup', userData);
    return response.data;
  }

  /**
   * --- เพิ่มเมธอดนี้เข้าไป ---
   * เมธอดสำหรับส่งข้อมูลไปเข้าสู่ระบบ
   * @param {object} credentials - ข้อมูลอีเมลและรหัสผ่าน
   */
  static async login(credentials) {
    // ส่งข้อมูลไปที่ endpoint 'login' ของ Backend
    const response = await axios.post(API_URL + 'login', {
      email: credentials.email,
      password: credentials.password,
    });

    // เมื่อ Login สำเร็จ, Backend จะส่งข้อมูลผู้ใช้ (และอาจจะมี token) กลับมา
    // เราจะเก็บข้อมูลนี้ไว้ใน localStorage เพื่อให้รู้ว่าผู้ใช้ Login อยู่
    if (response.data.user) { // หรือ response.data.token ถ้ามี
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  }

  /**
   * เมธอดสำหรับออกจากระบบ
   */
  static logout() {
    localStorage.removeItem('user');
  }

  /**
   * เมธอดสำหรับดึงข้อมูลผู้ใช้ที่ Login อยู่จาก localStorage
   */
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

export { AuthService };
