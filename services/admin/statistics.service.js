import { apiAdminAxios } from "../rootApi";

export const getUserStatistics = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/users/statistic/total",
    });
    return response;
};

export const getDeviceStatistics = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/device/statistic/total",
    });
    return response;
};

export const getMostBorrowedDevices = async (params = {}) => {
    const { month, year, limit = 5 } = params;
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

export const getBorrowRequestStats = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/borrow-requests/stats",
    });
    return response;
};
