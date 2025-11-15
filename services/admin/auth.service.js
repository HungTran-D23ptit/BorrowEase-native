import { setAuthTokenAdmin } from "../../utils/localStorage.js";
import { apiAdminAxios } from "../rootApi";

export const adminLogin = async (credentials) => {
  console.log("[adminLogin] credentials:", credentials);
  const response = await apiAdminAxios({
    method: "post",
    url: "/admin/auth/login",
    data: credentials,
  });
  if (response.data?.token) {
    setAuthTokenAdmin(response.data.token);
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
  if (response.data?.token) {
    setAuthTokenAdmin(response.data.token);
  }
  return response;
};
