import axios from "axios";
import { getAuthToken, getAuthTokenAdmin } from "../utils/localStorage.js";

const baseUrl = "http://10.0.2.2:3456";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl.replace('localhost', '10.0.2.2').replace('http://localhost', 'http://10.0.2.2');
  }

  if (imageUrl.startsWith('uploads/') || imageUrl.startsWith('/uploads/')) {
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}/static${cleanPath}`;
  }

  if (imageUrl.startsWith('/static/')) {
    return `${baseUrl}${imageUrl}`;
  }

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
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return { ...response, data: response.data.data };
    }
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
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
