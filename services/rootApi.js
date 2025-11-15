import axios from "axios";
import { getAuthToken, getAuthTokenAdmin } from "../utils/localStorage.js";

const baseUrl = "http://10.0.2.2:3456";

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
