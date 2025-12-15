import { apiAxios } from "../rootApi";

/**
 * Lấy danh sách thông báo với phân trang
 * @param {Object} params - { page, per_page }
 * @returns {Promise} Response với { total, page, per_page, notifications }
 */
export const getNotifications = async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAxios({
        method: "get",
        url: `/user/notifications?${queryParams.toString()}`,
    });
    return response.data;
};

/**
 * Đếm số thông báo chưa đọc
 * @returns {Promise<number>} Số lượng thông báo chưa đọc
 */
export const getUnreadCount = async () => {
    const response = await apiAxios({
        method: "get",
        url: "/user/notifications/unread-count",
    });
    return response.data;
};

/**
 * Đánh dấu một thông báo đã đọc
 * @param {string} id - ID của thông báo
 * @returns {Promise} Response với { updated, message, notification }
 */
export const markAsRead = async (id) => {
    const response = await apiAxios({
        method: "patch",
        url: `/user/notifications/${id}/read`,
    });
    return response.data;
};

/**
 * Đánh dấu tất cả thông báo đã đọc
 * @returns {Promise} Response với { updated, message }
 */
export const markAllAsRead = async () => {
    const response = await apiAxios({
        method: "patch",
        url: "/user/notifications/mark-all-read",
    });
    return response.data;
};

/**
 * Xóa một thông báo
 * @param {string} id - ID của thông báo
 * @returns {Promise} Response với { message, notification }
 */
export const deleteNotification = async (id) => {
    const response = await apiAxios({
        method: "delete",
        url: `/user/notifications/${id}`,
    });
    return response.data;
};
