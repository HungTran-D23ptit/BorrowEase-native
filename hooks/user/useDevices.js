import { getDeviceDetail, getDevices, getRecommendedDevices } from '@/services/user/device.service';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook to fetch and manage devices list
 */
export const useDevices = (initialParams = {}) => {
    const [devices, setDevices] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({
        page: 1,
        per_page: 10,
        ...initialParams,
    });

    const fetchDevices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDevices(params);
            setDevices(response.data || []);
            setPagination(response.pagination || null);
        } catch (err) {
            setError(err.message || 'Failed to fetch devices');
            setDevices([]);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const refresh = useCallback(() => {
        fetchDevices();
    }, [fetchDevices]);

    const updateParams = useCallback((newParams) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    const loadMore = useCallback(() => {
        if (pagination && pagination.page < pagination.total_pages) {
            updateParams({ page: pagination.page + 1 });
        }
    }, [pagination, updateParams]);

    return {
        devices,
        pagination,
        loading,
        error,
        refresh,
        updateParams,
        loadMore,
        params,
    };
};

/**
 * Hook to fetch device detail
 */
export const useDeviceDetail = (deviceId, initialParams = {}) => {
    const [device, setDevice] = useState(null);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [historyPagination, setHistoryPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({
        page: 1,
        per_page: 5,
        ...initialParams,
    });

    const fetchDeviceDetail = useCallback(async () => {
        if (!deviceId) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getDeviceDetail(deviceId, params);

            // API trả về device data trực tiếp, không có wrapper
            setDevice(response || null);

            // Borrow history nằm trong field 'reviews'
            setBorrowHistory(response?.reviews?.data || []);
            setHistoryPagination({
                page: parseInt(response?.reviews?.page || 1),
                per_page: parseInt(response?.reviews?.per_page || 5),
                total: response?.reviews?.total || 0,
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch device detail');
            setDevice(null);
        } finally {
            setLoading(false);
        }
    }, [deviceId, params]);

    useEffect(() => {
        fetchDeviceDetail();
    }, [fetchDeviceDetail]);

    const refresh = useCallback(() => {
        fetchDeviceDetail();
    }, [fetchDeviceDetail]);

    const loadMoreHistory = useCallback(() => {
        if (historyPagination && historyPagination.page < historyPagination.total_pages) {
            setParams(prev => ({ ...prev, page: historyPagination.page + 1 }));
        }
    }, [historyPagination]);

    return {
        device,
        borrowHistory,
        historyPagination,
        loading,
        error,
        refresh,
        loadMoreHistory,
    };
};

/**
 * Hook to fetch recommended devices
 */
export const useRecommendedDevices = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRecommendedDevices();
            setRecommendations(response.result || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch recommendations');
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const refresh = useCallback(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    return {
        recommendations,
        loading,
        error,
        refresh,
    };
};
