import { useCallback, useEffect, useState } from 'react';
import * as deviceService from '../../services/admin/device.service';
import * as ToastService from '../../services/ToastService';
import { handleApiError } from '../../utils/errorHandler';

// Hook để lấy danh sách thiết bị với phân trang và lọc
export const useDevices = () => {
    const [devices, setDevices] = useState([]);
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
        search: '',
        type: '',
        status: '',
    });

    const fetchDevices = useCallback(async (page = 1, isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await deviceService.getDevices({
                page,
                per_page: pagination.perPage,
                ...filters,
            });

            if (response && response.data) {
                // API trả về: { total, page, per_page, data: [...] }
                const devicesList = response.data.data || [];

                if (isRefresh || page === 1) {
                    setDevices(devicesList);
                } else {
                    // Load more - append to existing devices
                    setDevices(prev => [...prev, ...devicesList]);
                }

                // Tính toán pagination
                const total = response.data.total || 0;
                const perPage = response.data.per_page || 10;
                const totalPages = Math.ceil(total / perPage);

                setPagination({
                    currentPage: response.data.page || page,
                    totalPages: totalPages,
                    totalItems: total,
                    perPage: perPage,
                });
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải danh sách thiết bị', false);
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filters, pagination.perPage]);

    useEffect(() => {
        fetchDevices(1);
    }, [filters]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const refresh = () => {
        fetchDevices(1, true);
    };

    const loadMore = () => {
        if (!loading && pagination.currentPage < pagination.totalPages) {
            fetchDevices(pagination.currentPage + 1);
        }
    };

    return {
        devices,
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

// Hook để lấy danh sách loại thiết bị
export const useDeviceTypes = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTypes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await deviceService.getDeviceTypes();
                if (response && response.data && response.data.types) {
                    // API trả về: { types: [{type: 'Camera', count: 1}, ...] }
                    // Chỉ lấy tên type
                    const typeNames = response.data.types.map(item => item.type);
                    setTypes(typeNames);
                }
            } catch (err) {
                const message = handleApiError(err, 'Không thể tải danh sách loại thiết bị', false);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
    }, []);

    return { types, loading, error };
};

// Hook để thực hiện các hành động với thiết bị
export const useDeviceActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createDevice = async (deviceData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deviceService.createDevice(deviceData);
            ToastService.showSuccess('Tạo thiết bị mới thành công');
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể tạo thiết bị', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDevice = async (id, deviceData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deviceService.updateDevice(id, deviceData);
            ToastService.showSuccess('Cập nhật thiết bị thành công');
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể cập nhật thiết bị', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDevice = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deviceService.deleteDevice(id);
            ToastService.showSuccess('Xóa thiết bị thành công');
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể xóa thiết bị', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const markMaintenance = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deviceService.markDeviceMaintenance(id);
            ToastService.showSuccess('Đánh dấu bảo trì thiết bị thành công');
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể đánh dấu bảo trì', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createDevice,
        updateDevice,
        deleteDevice,
        markMaintenance,
        loading,
        error,
    };
};

// Hook để lấy chi tiết thiết bị
export const useDeviceDetail = (deviceId) => {
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsPagination, setReviewsPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 5,
    });

    const fetchDeviceDetail = useCallback(async (page = 1, isRefresh = false) => {
        if (!deviceId) return;

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await deviceService.getDeviceById(deviceId, {
                page,
                per_page: reviewsPagination.perPage,
            });

            if (response && response.data) {
                // API trả về device object trực tiếp với reviews nested
                const deviceData = response.data;

                // Set device info (không bao gồm reviews)
                const { reviews: reviewsData, ...deviceInfo } = deviceData;
                setDevice(deviceInfo);

                // Parse reviews
                if (reviewsData) {
                    const reviewsList = reviewsData.data || [];

                    if (isRefresh || page === 1) {
                        setReviews(reviewsList);
                    } else {
                        setReviews(prev => [...prev, ...reviewsList]);
                    }

                    // Tính toán pagination cho reviews
                    const total = reviewsData.total || 0;
                    const perPage = parseInt(reviewsData.per_page) || 5;
                    const totalPages = Math.ceil(total / perPage);

                    setReviewsPagination({
                        currentPage: parseInt(reviewsData.page) || page,
                        totalPages: totalPages,
                        totalItems: total,
                        perPage: perPage,
                    });
                }
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải chi tiết thiết bị', false);
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [deviceId, reviewsPagination.perPage]);

    useEffect(() => {
        if (deviceId) {
            fetchDeviceDetail(1);
        }
    }, [deviceId]);

    const refresh = () => {
        fetchDeviceDetail(1, true);
    };

    const loadMoreReviews = () => {
        if (!loading && reviewsPagination.currentPage < reviewsPagination.totalPages) {
            fetchDeviceDetail(reviewsPagination.currentPage + 1);
        }
    };

    return {
        device,
        reviews,
        loading,
        refreshing,
        error,
        reviewsPagination,
        refresh,
        loadMoreReviews,
    };
};
