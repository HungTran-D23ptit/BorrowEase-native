import { apiAxios } from '../rootApi';

/**
 * Tạo đơn mượn thiết bị
 * @param {string} deviceId - ID của thiết bị
 * @param {Object} data - Dữ liệu đơn mượn { quantity, borrow_date, return_date, reason }
 */
export const createBorrowRequest = async (deviceId, data) => {
    try {
        const response = await apiAxios({
            method: 'post',
            url: `/user/borrow-requests/${deviceId}/borrow`,
            data,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating borrow request:', error);
        throw error;
    }
};

/**
 * Lấy danh sách đơn mượn theo trạng thái
 * @param {Object} params - { status, page, per_page }
 * status có thể là: 'pending', 'approved', 'rejected', 'cancelled', 'borrowing', 'returned', 'overdue'
 */
export const getBorrowRequests = async (params = {}) => {
    try {
        const { status, page = 1, per_page = 10 } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        if (status) queryParams.append('status', status);

        const response = await apiAxios({
            method: 'get',
            url: `/user/borrow-requests?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching borrow requests:', error);
        throw error;
    }
};

/**
 * Xem chi tiết đơn mượn
 * @param {string} requestId - ID của đơn mượn
 */
export const getBorrowRequestDetail = async (requestId) => {
    try {
        const response = await apiAxios({
            method: 'get',
            url: `/user/borrow-requests/detail/${requestId}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching borrow request detail:', error);
        throw error;
    }
};

/**
 * Hủy đơn mượn (chỉ khi status = 'pending')
 * @param {string} requestId - ID của đơn mượn
 */
export const cancelBorrowRequest = async (requestId) => {
    try {
        const response = await apiAxios({
            method: 'delete',
            url: `/user/borrow-requests/${requestId}/cancel`,
        });
        return response.data;
    } catch (error) {
        console.error('Error cancelling borrow request:', error);
        throw error;
    }
};

/**
 * Yêu cầu trả thiết bị (User gửi yêu cầu trả)
 * @param {string} requestId - ID của đơn mượn
 */
export const requestReturnDevice = async (requestId) => {
    try {
        const response = await apiAxios({
            method: 'patch',
            url: `/user/borrow-requests/${requestId}/request-return`,
        });
        return response.data;
    } catch (error) {
        console.error('Error requesting return device:', error);
        throw error;
    }
};

/**
 * Lấy danh sách thiết bị đang mượn
 * @param {Object} params - { page, per_page }
 */
export const getBorrowingDevices = async (params = {}) => {
    try {
        const { page = 1, per_page = 10 } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        const response = await apiAxios({
            method: 'get',
            url: `/user/borrow-requests/borrowing?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching borrowing devices:', error);
        throw error;
    }
};

/**
 * Lấy danh sách thiết bị quá hạn
 * @param {Object} params - { page, per_page }
 */
export const getOverdueDevices = async (params = {}) => {
    try {
        const { page = 1, per_page = 10 } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        const response = await apiAxios({
            method: 'get',
            url: `/user/borrow-requests/overdue?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching overdue devices:', error);
        throw error;
    }
};

/**
 * Lấy danh sách thiết bị đã trả
 * @param {Object} params - { page, per_page }
 */
export const getReturnedDevices = async (params = {}) => {
    try {
        const { page = 1, per_page = 10 } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        const response = await apiAxios({
            method: 'get',
            url: `/user/borrow-requests/returned?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching returned devices:', error);
        throw error;
    }
};

/**
 * Đánh giá thiết bị đã mượn
 * @param {string} requestId - ID của đơn mượn
 * @param {Object} data - { rating, comment }
 */
export const reviewDevice = async (requestId, data) => {
    try {
        const response = await apiAxios({
            method: 'post',
            url: `/user/borrow-requests/${requestId}/review`,
            data,
        });
        return response.data;
    } catch (error) {
        console.error('Error reviewing device:', error);
        throw error;
    }
};

/**
 * Lấy lịch sử mượn thiết bị
 * @param {Object} params - { page, per_page }
 */
export const getAllBorrowHistory = async (params = {}) => {
    try {
        const { page = 1, per_page = 10 } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        const response = await apiAxios({
            method: 'get',
            url: `/user/borrow-requests/history/all?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching borrow history:', error);
        throw error;
    }
};

/**
 * Lấy thống kê đơn mượn của user
 */
export const getUserBorrowStats = async () => {
    try {
        const response = await apiAxios({
            method: 'get',
            url: '/user/borrow-requests/stats',
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user borrow stats:', error);
        throw error;
    }
};
