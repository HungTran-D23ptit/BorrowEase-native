import { apiAdminAxios } from "../rootApi";

/**
 * Lấy danh sách tất cả đơn mượn
 * @param {Object} params - { status, page, per_page }
 */
export const getBorrowRequests = async (params = {}) => {
    const { status, page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();

    if (status) queryParams.append("status", status);
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/borrow-requests?${queryParams.toString()}`,
    });
    return response;
};

/**
 * Lấy danh sách thiết bị đang được mượn (APPROVED)
 */
export const getApprovedRequests = async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/borrow-requests/approved?${queryParams.toString()}`,
    });
    return response;
};

/**
 * Lấy danh sách thiết bị quá hạn (OVERDUE)
 */
export const getOverdueRequests = async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/borrow-requests/overdue?${queryParams.toString()}`,
    });
    return response;
};

/**
 * Lấy danh sách thiết bị đã trả (RETURNED)
 */
export const getReturnedRequests = async (params = {}) => {
    const { user, page = 1, per_page = 10 } = params;
    const queryParams = new URLSearchParams();

    if (user) queryParams.append("user", user);
    queryParams.append("page", page.toString());
    queryParams.append("per_page", per_page.toString());

    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/borrow-requests/returned?${queryParams.toString()}`,
    });
    return response;
};

/**
 * Lấy thống kê số lượng đơn mượn theo trạng thái
 */
export const getBorrowRequestStats = async () => {
    const response = await apiAdminAxios({
        method: "get",
        url: "/admin/borrow-requests/stats",
    });
    return response;
};

/**
 * Lấy chi tiết một đơn mượn
 * @param {String} id - ID của đơn mượn
 */
export const getBorrowRequestById = async (id) => {
    const response = await apiAdminAxios({
        method: "get",
        url: `/admin/borrow-requests/${id}`,
    });
    return response;
};

/**
 * Duyệt đơn mượn
 * @param {String} id - ID của đơn mượn
 */
export const approveBorrowRequest = async (id) => {
    const response = await apiAdminAxios({
        method: "patch",
        url: `/admin/borrow-requests/${id}/approve`,
    });
    return response;
};

/**
 * Từ chối đơn mượn
 * @param {String} id - ID của đơn mượn
 * @param {String} note - Lý do từ chối
 */
export const rejectBorrowRequest = async (id, note) => {
    const response = await apiAdminAxios({
        method: "patch",
        url: `/admin/borrow-requests/${id}/reject`,
        data: { note },
    });
    return response;
};

/**
 * Xác nhận đã nhận lại thiết bị
 * @param {String} id - ID của đơn mượn
 */
export const confirmReturnRequest = async (id) => {
    const response = await apiAdminAxios({
        method: "patch",
        url: `/admin/borrow-requests/${id}/confirm-return`,
    });
    return response;
};
