import { apiAxios } from "../rootApi";

// Admin Authentication
export const adminLogin = (data) => {
  return apiAxios({
    method: "post",
    url: "/admin/auth/login",
    data: data,
  });
};

export const adminLogout = () => {
  return apiAxios({
    method: "post",
    url: "/admin/auth/logout",
  });
};

// User Management
export const getAllUsers = (params = {}) => {
  return apiAxios({
    method: "get",
    url: "/admin/users",
    params: params,
  });
};

export const getUserDetails = (userId) => {
  return apiAxios({
    method: "get",
    url: `/admin/users/${userId}`,
  });
};

export const updateUserStatus = (userId, data) => {
  return apiAxios({
    method: "put",
    url: `/admin/users/${userId}/status`,
    data: data,
  });
};

export const deleteUser = (userId) => {
  return apiAxios({
    method: "delete",
    url: `/admin/users/${userId}`,
  });
};
