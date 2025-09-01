"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// File: src/services/auth.service.js
const axios_1 = __importDefault(require("axios"));
const apiClient = axios_1.default.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});
class AuthService {
    register(userData) {
        var _a;
        const dataToSend = {
            prefix: userData.prefix,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: (_a = userData.phone) === null || _a === void 0 ? void 0 : _a.replace(/-/g, ''),
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
exports.default = new AuthService();
