import * as statisticsService from '@/services/admin/statistics.service';
import { handleApiError } from '@/utils/errorHandler';
import { useCallback, useEffect, useState } from 'react';

/**
 * @typedef {Object} UserStats
 * @property {number} total
 */

/**
 * @typedef {Object} DeviceStats
 * @property {number} total
 */

/**
 * @typedef {Object} RequestStats
 * @property {number} PENDING
 * @property {number} APPROVED
 * @property {number} REJECTED
 * @property {number} RETURNING
 * @property {number} RETURNED
 * @property {number} OVERDUE
 * @property {number} CANCELLED
 */

export const useStatistics = () => {
    const [userStats, setUserStats] = useState(/** @type {UserStats | null} */(null));
    const [deviceStats, setDeviceStats] = useState(/** @type {DeviceStats | null} */(null));
    const [requestStats, setRequestStats] = useState(/** @type {RequestStats | null} */(null));
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
