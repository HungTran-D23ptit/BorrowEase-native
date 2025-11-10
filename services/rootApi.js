import axios from "axios";

const BASE_URL = "YOUR_API_BASE_URL"; // Thay thế bằng URL API của bạn

export const apiAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho requests
apiAxios.interceptors.request.use(
  (config) => {
    // Bạn có thể thêm token authentication ở đây
    const token = ""; // Lấy token từ storage của bạn
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho responses
apiAxios.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error:", error.response.data);
      // Xử lý các trường hợp lỗi cụ thể
      switch (error.response.status) {
        case 401:
          // Xử lý unauthorized
          break;
        case 403:
          // Xử lý forbidden
          break;
        case 404:
          // Xử lý not found
          break;
      }
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
