import axios from "axios";
import { getAuthToken, getAuthTokenAdmin } from "../utils/localStorage.js";

const baseUrl = "http://10.0.2.2:3456";

// Utility function để xử lý image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // Nếu đã là full URL (http/https)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Thay thế localhost bằng 10.0.2.2 cho Android emulator
    return imageUrl.replace('localhost', '10.0.2.2').replace('http://localhost', 'http://10.0.2.2');
  }

  // Nếu là relative path
  if (imageUrl.startsWith('uploads/') || imageUrl.startsWith('/uploads/')) {
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}/static${cleanPath}`;
  }

  // Nếu đã có /static
  if (imageUrl.startsWith('/static/')) {
    return `${baseUrl}${imageUrl}`;
  }

  // Default: thêm /static/uploads/
  return `${baseUrl}/static/uploads/${imageUrl}`;
};

export const apiAxios = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAxios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const apiAdminAxios = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAdminAxios.interceptors.request.use(
  (config) => {
    const tokenAdmin = getAuthTokenAdmin();
    if (tokenAdmin) {
      config.headers.Authorization = `Bearer ${tokenAdmin}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiAdminAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
