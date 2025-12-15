import * as statisticsService from '@/services/admin/statistics.service';
import { handleApiError } from '@/utils/errorHandler';
import { useCallback, useEffect, useState } from 'react';

export const useStatistics = () => {
    const [userStats, setUserStats] = useState(null);
    const [deviceStats, setDeviceStats] = useState(null);
    const [requestStats, setRequestStats] = useState(null);
    const [mostBorrowed, setMostBorrowed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllStats = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            const [userRes, deviceRes, requestRes] = await Promise.all([
                statisticsService.getUserStatistics(),
                statisticsService.getDeviceStatistics(),
                statisticsService.getBorrowRequestStats(),
            ]);

            if (userRes?.data) {
                setUserStats(userRes.data);
            }

            if (deviceRes?.data?.total) {
                setDeviceStats(deviceRes.data.total);
            }

            // Response interceptor đã unwrap data rồi
            if (requestRes?.data) {
                setRequestStats(requestRes.data.data || requestRes.data);
            }

            try {
                const borrowedRes = await statisticsService.getMostBorrowedDevices({
                    month: currentMonth,
                    year: currentYear,
                    limit: 5
                });
                // Response interceptor đã unwrap data rồi
                if (borrowedRes?.data) {
                    setMostBorrowed(borrowedRes.data.data || borrowedRes.data);
                }
            } catch (err) {
                console.log('Most borrowed API not available:', err.message);
                setMostBorrowed([]);
            }
        } catch (err) {
            handleApiError(err, 'Không thể tải thống kê', false);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAllStats();
    }, [fetchAllStats]);

    const refresh = useCallback(() => {
        fetchAllStats(true);
    }, [fetchAllStats]);

    return {
        userStats,
        deviceStats,
        requestStats,
        mostBorrowed,
        loading,
        refreshing,
        refresh,
    };
};
