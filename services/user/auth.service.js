import { setAuthToken } from "../../utils/localStorage.js";
import { apiAxios } from "../rootApi";

export const userLogin = async (credentials) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/login",
    data: credentials,
  });
  const token = response.data?.access_token || response.data?.data?.access_token;
  if (token) {
    await setAuthToken(token);
  }
  return response;
};

export const userRegister = async (data) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/register",
    data: data,
  });
  const token = response.data?.access_token || response.data?.data?.access_token;
  if (token) {
    await setAuthToken(token);
  }
  return response;
};

export const userLoginWithGoogle = async (data) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/login/google",
    data: data,
  });
  const token = response.data?.access_token || response.data?.data?.access_token;
  if (token) {
    await setAuthToken(token);
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

export const userResetPassword = async (email, otp, newPassword, confirmPassword) => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/reset-password",
    data: { email, otp, newPassword, confirmPassword },
  });
  return response;
};

export const userLogout = async () => {
  const response = await apiAxios({
    method: "post",
    url: "/user/auth/logout",
  });
  return response;
};

export const userChangePassword = async (oldPassword, newPassword, confirmPassword) => {
  const response = await apiAxios({
    method: "put",
    url: "/user/auth/change-password",
    data: {
      currentPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    },
  });
  return response;
};
