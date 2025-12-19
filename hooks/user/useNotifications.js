import { useState, useEffect, useCallback } from 'react';
import * as notificationService from '../../services/user/notification.service';

/**
 * Hook để lấy danh sách thông báo với phân trang
 */
export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
    });

    const fetchNotifications = useCallback(async (page = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await notificationService.getNotifications({
                page,
                per_page: 10, // Use fixed value instead of pagination.per_page
            });

            if (page === 1) {
                setNotifications(response.notifications || []);
            } else {
                setNotifications(prev => [...prev, ...(response.notifications || [])]);
            }

            setPagination({
                page: response.page || page,
                per_page: response.per_page || 10,
                total: response.total || 0,
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []); // Empty dependencies since we use fixed per_page

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const refresh = useCallback(() => {
        fetchNotifications(1, true);
    }, [fetchNotifications]);

    const loadMore = useCallback(() => {
        if (!loading && !refreshing) {
            const hasMore = notifications.length < pagination.total;
            if (hasMore) {
                fetchNotifications(pagination.page + 1);
            }
        }
    }, [loading, refreshing, notifications.length, pagination.total, pagination.page, fetchNotifications]);

    return {
        notifications,
        loading,
        refreshing,
        pagination,
        refresh,
        loadMore,
    };
};

/**
 * Hook để đếm số thông báo chưa đọc
 */
export const useUnreadCount = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCount = async () => {
        try {
            setLoading(true);
            const unreadCount = await notificationService.getUnreadCount();
            setCount(unreadCount || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
            setCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCount();
    }, []);

    const refresh = useCallback(() => {
        fetchCount();
    }, []);

    return {
        count,
        loading,
        refresh,
    };
};

/**
 * Hook để thực hiện các actions với thông báo
 */
export const useNotificationActions = () => {
    const markAsRead = async (id) => {
        try {
            const response = await notificationService.markAsRead(id);
            return response;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await notificationService.markAllAsRead();
            return response;
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    };

    const deleteNotification = async (id) => {
        try {
            const response = await notificationService.deleteNotification(id);
            return response;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    };

    return {
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
};
