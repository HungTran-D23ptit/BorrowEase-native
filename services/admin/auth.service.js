import { setAuthTokenAdmin } from "../../utils/localStorage.js";
import { apiAdminAxios } from "../rootApi";

export const adminLogin = async (credentials) => {
  const response = await apiAdminAxios({
    method: "post",
    url: "/admin/auth/login",
    data: credentials,
  });
  const token = response.data?.access_token || response.data?.data?.access_token;
  if (token) {
    await setAuthTokenAdmin(token);
  }
  return response;
};

export const adminForgotPassword = (email) => {
  return apiAdminAxios({
    method: "post",
    url: "/admin/auth/forgot-password",
    data: { email },
  });
};

export const adminVerifyOTP = (email, otp) => {
  return apiAdminAxios({
    method: "post",
    url: "/admin/auth/verify-otp",
    data: { email, otp },
  });
};

export const adminResetPassword = async (email, otp, newPassword) => {
  const response = await apiAdminAxios({
    method: "post",
    url: "/admin/auth/reset-password",
    data: { email, otp, newPassword },
  });
  const token = response.data?.access_token || response.data?.data?.access_token;
  if (token) {
    await setAuthTokenAdmin(token);
  }
  return response;
};

export const adminLogout = async () => {
  const response = await apiAdminAxios({
    method: "post",
    url: "/admin/auth/logout",
  });
  return response;
};
