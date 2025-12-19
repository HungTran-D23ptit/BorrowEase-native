import { apiAdminAxios } from "../rootApi";

export const getDevices = async (params = {}) => {
    const { page = 1, per_page = 10, status, type, search } = params;
    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());
    if (status) queryParams.append("status", status);
    if (type) queryParams.append("type", type);
    if (search) queryParams.append("search", search);

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/device?${queryParams.toString()}`,
    });
    return response;
};

export const getDeviceById = async (id, params = {}) => {
    const { page = 1, per_page = 5 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/device/${id}?${queryParams.toString()}`,
    });
    return response;
};

export const createDevice = async (deviceData) => {
    const response = await apiAdminAxios({
        method: "post",
        url: "/admin/device",
        data: deviceData,
    });
    return response;
};

export const updateDevice = async (id, deviceData) => {
    const response = await apiAdminAxios({
        method: "put",
        url: `/admin/device/${id}`,
        data: deviceData,
    });
    return response;
};

export const deleteDevice = async (id) => {
    const response = await apiAdminAxios({
        method: "delete",
        url: `/admin/device/${id}`,
    });
    return response;
};

export const getDeviceTypes = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/device/types",
    });
    return response;
};

export const getMostBorrowedDevices = async (params = {}) => {
    const { month, year, limit = 10 } = params;
    const queryParams = new URLSearchParams();

    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());
    queryParams.append("limit", limit.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/device/stats/most-borrowed?${queryParams.toString()}`,
    });
    return response;
};

export const markDeviceMaintenance = async (id) => {
    const response = await apiAdminAxios({
        method: "patch",
        url: `/admin/device/${id}/maintenance`,
    });
    return response;
};

export const getTotalDevices = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/device/statistic/total",
    });
    return response;
};
