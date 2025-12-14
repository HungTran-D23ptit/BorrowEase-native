import * as userService from '@/services/admin/user.service';
import { handleApiError } from '@/utils/errorHandler';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
    });

    const fetchUsers = useCallback(async (page = 1, isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await userService.getUsers({
                page,
                per_page: 10,
            });

            if (response && response.data) {
                const userData = response.data.data || [];
                const paginationData = response.data.pagination || {};

                if (isRefresh || page === 1) {
                    setUsers(userData);
                } else {
                    setUsers(prev => [...prev, ...userData]);
                }

                setPagination({
                    page: paginationData.page || page,
                    per_page: paginationData.per_page || 10,
                    total: paginationData.total || 0,
                });
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải danh sách người dùng', false);
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    const refresh = useCallback(() => {
        fetchUsers(1, true);
    }, [fetchUsers]);

    const loadMore = () => {
        const totalPages = Math.ceil(pagination.total / pagination.per_page);
        if (!loading && pagination.page < totalPages) {
            fetchUsers(pagination.page + 1);
        }
    };

    return {
        users,
        loading,
        refreshing,
        error,
        pagination,
        refresh,
        loadMore,
    };
};

export const useUserDetail = (userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserDetail = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await userService.getUserById(userId);
            if (response && response.data && response.data.data) {
                setUser(response.data.data);
            }
        } catch (err) {
            const message = handleApiError(err, 'Không thể tải thông tin người dùng', false);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchUserDetail();
        }
    }, [userId]);

    return {
        user,
        loading,
        error,
        refresh: fetchUserDetail,
    };
};

export const useUserStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.getUserStatistics();
            if (response && response.data && response.data.data) {
                setStats(response.data.data);
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

export const useUserActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createUser = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.createUser(userData);
            Alert.alert('Thành công', 'Tạo người dùng thành công');
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể tạo người dùng', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id, userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.updateUser(id, userData);
            Alert.alert('Thành công', 'Cập nhật người dùng thành công');
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể cập nhật người dùng', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.deleteUser(id);
            console.log('Delete user response:', response);
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể khóa tài khoản', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const activateUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.activateUser(id);
            console.log('Activate user response:', response);
            return response;
        } catch (err) {
            const message = handleApiError(err, 'Không thể mở khóa tài khoản', true);
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return {
        createUser,
        updateUser,
        deleteUser,
        activateUser,
        loading,
        error,
    };
};

export const useUserStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService.getUserStatistics();
            if (response?.data) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch user stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        refresh: fetchStats,
    };
};
