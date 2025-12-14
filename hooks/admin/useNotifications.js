import * as notificationService from '@/services/admin/notification.service';
import { handleApiError } from '@/utils/errorHandler';
import { useCallback, useEffect, useState } from 'react';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
    });

    const fetchNotifications = useCallback(async (page = 1, isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await notificationService.getNotifications({
                page,
                per_page: 10,
            });

            if (response && response.data && response.data.data) {
                const notifData = response.data.data.notifications || [];
                const total = response.data.data.total || 0;
                const currentPage = response.data.data.page || page;
                const perPage = response.data.data.per_page || 10;

                if (isRefresh || page === 1) {
                    setNotifications(notifData);
                } else {
                    setNotifications(prev => [...prev, ...notifData]);
                }

                setPagination({
                    page: currentPage,
                    per_page: perPage,
                    total: total,
                });
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải thông báo', false);
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const refresh = useCallback(() => {
        fetchNotifications(1, true);
    }, [fetchNotifications]);

    const loadMore = () => {
        const totalPages = Math.ceil(pagination.total / pagination.per_page);
        if (!loading && pagination.page < totalPages) {
            fetchNotifications(pagination.page + 1);
        }
    };

    return {
        notifications,
        loading,
        refreshing,
        error,
        pagination,
        refresh,
        loadMore,
    };
};

export const useUnreadCount = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCount = useCallback(async () => {
        setLoading(true);
        try {
            const response = await notificationService.getUnreadCount();
            if (response && response.data && response.data.data !== undefined) {
                setCount(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [fetchCount]);

    return { count, loading, refresh: fetchCount };
};

export const useNotificationActions = () => {
    const [loading, setLoading] = useState(false);

    const markAsRead = async (id) => {
        setLoading(true);
        try {
            await notificationService.markAsRead(id);
            return true;
        } catch (err) {
            handleApiError(err, 'Không thể đánh dấu đã đọc', true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        setLoading(true);
        try {
            await notificationService.markAllAsRead();
            return true;
        } catch (err) {
            handleApiError(err, 'Không thể đánh dấu tất cả đã đọc', true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        setLoading(true);
        try {
            await notificationService.deleteNotification(id);
            return true;
        } catch (err) {
            handleApiError(err, 'Không thể xóa thông báo', true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading,
    };
};
