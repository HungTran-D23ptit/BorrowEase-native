import { apiAxios } from "../rootApi";

// Authentication APIs
export const login = (data) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/login",
    data: data,
  });
};

export const register = (data) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/register",
    data: data,
  });
};

export const logout = () => {
  return apiAxios({
    method: "post",
    url: "/user/auth/logout",
  });
};

export const loginWithGoogle = (data) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/login/google",
    data: data,
  });
};

// Profile APIs
export const getProfile = () => {
  return apiAxios({
    method: "get",
    url: "/user/profile",
  });
};

export const updateProfile = (data) => {
  return apiAxios({
    method: "put",
    url: "/user/profile",
    data: data,
  });
};

// Password Management APIs
export const changePassword = (data) => {
  return apiAxios({
    method: "put",
    url: "/user/auth/change-password",
    data,
  });
};

export const forgotPassword = (data) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/forgot-password",
    data,
  });
};

export const resetPassword = (data) => {
  return apiAxios({
    method: "post",
    url: "/user/auth/reset-password",
    data,
  });
};
