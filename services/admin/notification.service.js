import { apiAdminAxios } from "../rootApi";

export const getNotifications = async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/notifications?${queryParams.toString()}`,
    });
    return response;
};

export const getUnreadCount = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/notifications/unread-count",
    });
    return response;
};

export const markAsRead = async (id) => {
    const response = await apiAdminAxios({
        method: "patch",
        url: `/admin/notifications/${id}/read`,
    });
    return response;
};

export const markAllAsRead = async () => {
    const response = await apiAdminAxios({
        method: "patch",
        url: "/admin/notifications/mark-all-read",
    });
    return response;
};

export const deleteNotification = async (id) => {
    const response = await apiAdminAxios({
        method: "delete",
        url: `/admin/notifications/${id}`,
    });
    return response;
};
