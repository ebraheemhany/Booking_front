// lib/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://repent-bonanza-alto.ngrok-free.dev/api/auth",
  withCredentials: true, // عشان الـ httpOnly cookie يتبعت مع كل request
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // مهم مع ngrok عشان يتخطى صفحة التحذير
  },
});

// Interceptor للتعامل مع الأخطاء بشكل موحد
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ممكن هنا تعمل redirect للـ login لو الـ session خلصت
      // window.location.href = "/feature/login";
    }
    return Promise.reject(error);
  },
);
