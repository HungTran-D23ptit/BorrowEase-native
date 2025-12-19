import { apiAdminAxios } from "../rootApi";

export const getUsers = async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/users?${queryParams.toString()}`,
    });
    return response;
};

export const getUserById = async (id) => {
    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/users/${id}`,
    });
    return response;
};

export const createUser = async (userData) => {
    const formData = new FormData();

    Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined && userData[key] !== null && userData[key] !== '') {
            if (key === 'avatar' && userData[key].uri) {
                formData.append('avatar', {
                    uri: userData[key].uri,
                    type: userData[key].type || 'image/jpeg',
                    name: userData[key].fileName || 'avatar.jpg',
                });
            } else {
                formData.append(key, userData[key]);
            }
        }
    });

    const response = await apiAdminAxios({
        method: "post",
        url: "/admin/users",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};

export const updateUser = async (id, userData) => {
    const formData = new FormData();

    Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined && userData[key] !== null) {
            if (key === 'avatar' && userData[key].uri) {
                formData.append('avatar', {
                    uri: userData[key].uri,
                    type: userData[key].type || 'image/jpeg',
                    name: userData[key].fileName || 'avatar.jpg',
                });
            } else {
                formData.append(key, userData[key]);
            }
        }
    });

    const response = await apiAdminAxios({
        method: "put",
        url: `/admin/users/${id}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};

export const deleteUser = async (id) => {
    const response = await apiAdminAxios({
        method: "delete",
        url: `/admin/users/${id}`,
    });
    return response;
};

export const activateUser = async (id) => {
    const response = await apiAdminAxios({
        method: "post",
        url: `/admin/users/${id}`,
    });
    return response;
};

export const getUserStatistics = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/users/statistic/total",
    });
    return response;
};
