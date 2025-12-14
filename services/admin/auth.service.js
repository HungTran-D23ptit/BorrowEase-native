import { setAuthTokenAdmin } from "../../utils/localStorage.js";
import { apiAdminAxios } from "../rootApi";

export const adminLogin = async (credentials) => {
  const response = await apiAdminAxios({
    method: "post",
    url: "/admin/auth/login",
    data: credentials,
  });
  if (response.data?.data?.access_token) {
    await setAuthTokenAdmin(response.data.data.access_token);
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
  if (response.data?.data?.access_token) {
    await setAuthTokenAdmin(response.data.data.access_token);
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
