import * as borrowRequestService from '@/services/admin/borrowRequest.service';
import { handleApiError } from '@/utils/errorHandler';
import { useCallback, useEffect, useState } from 'react';

// Hook để lấy danh sách đơn mượn
export const useBorrowRequests = (initialStatus = '') => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
    });
    const [filters, setFilters] = useState({
        status: initialStatus,
    });

    const fetchRequests = useCallback(async (page = 1, isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await borrowRequestService.getBorrowRequests({
                ...filters,
                page,
                per_page: pagination.perPage,
            });

            // API trả về: { status, success, message, data: { total, page, per_page, requests } }
            // Response interceptor đã unwrap data rồi nên response.data chính là data object
            if (response && response.data) {
                const apiData = response.data.data || response.data; // Fallback for both cases
                const requestsList = apiData.requests || [];

                if (isRefresh || page === 1) {
                    setRequests(requestsList);
                } else {
                    setRequests(prev => [...prev, ...requestsList]);
                }

                const total = apiData.total || 0;
                const perPage = apiData.per_page || 10;
                const totalPages = Math.ceil(total / perPage);

                setPagination({
                    currentPage: apiData.page || page,
                    totalPages: totalPages,
                    totalItems: total,
                    perPage: perPage,
                });
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải danh sách đơn mượn', false);
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filters, pagination.perPage]);

    useEffect(() => {
        fetchRequests(1);
    }, [filters]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const refresh = () => {
        fetchRequests(1, true);
    };

    const loadMore = () => {
        if (!loading && pagination.currentPage < pagination.totalPages) {
            fetchRequests(pagination.currentPage + 1);
        }
    };

    return {
        requests,
        loading,
        refreshing,
        error,
        pagination,
        filters,
        updateFilters,
        refresh,
        loadMore,
    };
};

// Hook để lấy thống kê
export const useBorrowRequestStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await borrowRequestService.getBorrowRequestStats();
            // API trả về: { status, success, message, data: { PENDING: 12, APPROVED: 25, ... } }
            // Response interceptor đã unwrap data rồi
            if (response && response.data) {
                setStats(response.data.data || response.data);
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải thống kê', false);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refresh: fetchStats };
};

// Hook để lấy chi tiết đơn mượn
export const useBorrowRequestDetail = (requestId) => {
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchDetail = useCallback(async (isRefresh = false) => {
        if (!requestId) return;

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await borrowRequestService.getBorrowRequestById(requestId);
            // API trả về: { status, success, message, data: { _id, user, device, ... } }
            // Response interceptor đã unwrap data rồi
            if (response && response.data) {
                setRequest(response.data.data || response.data);
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải chi tiết đơn mượn', false);
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [requestId]);

    useEffect(() => {
        if (requestId) {
            fetchDetail();
        }
    }, [requestId]);

    const refresh = () => {
        fetchDetail(true);
    };

    return {
        request,
        loading,
        refreshing,
        error,
        refresh,
    };
};

// Hook để thực hiện các hành động với đơn mượn
export const useBorrowRequestActions = (callbacks = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { onSuccess, onError } = callbacks;

    const approveRequest = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await borrowRequestService.approveBorrowRequest(id);
            if (onSuccess) {
                onSuccess('Duyệt đơn mượn thành công');
            }
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể duyệt đơn mượn', false);
            setError(message);
            if (onError) {
                onError(message);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const rejectRequest = async (id, note) => {
        if (!note || note.trim() === '') {
            if (onError) {
                onError('Vui lòng nhập lý do từ chối');
            }
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await borrowRequestService.rejectBorrowRequest(id, note);
            if (onSuccess) {
                onSuccess('Từ chối đơn mượn thành công');
            }
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể từ chối đơn mượn', false);
            setError(message);
            if (onError) {
                onError(message);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmReturn = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await borrowRequestService.confirmReturnRequest(id);
            if (onSuccess) {
                onSuccess('Xác nhận trả thiết bị thành công');
            }
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể xác nhận trả thiết bị', false);
            setError(message);
            if (onError) {
                onError(message);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        approveRequest,
        rejectRequest,
        confirmReturn,
        loading,
        error,
    };
};
