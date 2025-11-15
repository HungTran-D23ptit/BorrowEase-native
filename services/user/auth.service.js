import { setAuthToken } from "../../utils/localStorage.js";
import { apiAxios } from "../rootApi";

export const userLogin = async (credentials) => {
  console.log("[userLogin] credentials:", credentials);
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/login",
    data: credentials,
  });
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response;
};

export const userRegister = async (data) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/register",
    data: data,
  });
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response;
};

export const userLoginWithGoogle = async (data) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/login/google",
    data: data,
  });
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response;
};

export const userForgotPassword = (email) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/forgot-password",
    data: { email },
  });
};

export const userVerifyOTP = (email, otp) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/verify-otp",
    data: { email, otp },
  });
};

export const userResetPassword = async (email, otp, newPassword) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/reset-password",
    data: { email, otp, newPassword },
  });
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response;
};
