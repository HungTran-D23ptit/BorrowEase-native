import { useStatistics } from '@/hooks/admin/useStatistics';
import { getImageUrl } from '@/services/rootApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { styles } from './styles';

const { width } = Dimensions.get('window');

const COLORS = {
    OVERDUE: '#FF3B30',
    PENDING: '#FF9500',
    APPROVED: '#007AFF',
    CANCELLED: '#8E8E93',
    RETURNED: '#34C759',
    REJECTED: '#FF2D55',
    RETURNING: '#5856D6',
};

const STATUS_LABELS = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đang mượn',
    REJECTED: 'Từ chối',
    RETURNING: 'Đang trả',
    RETURNED: 'Đã trả',
    OVERDUE: 'Quá hạn',
    CANCELLED: 'Đã hủy',
};

export default function StatisticsScreen() {
    const { userStats, deviceStats, requestStats, mostBorrowed, loading, refreshing, refresh } = useStatistics();

    const requestSlices = useMemo(() => {
        if (!requestStats) return [];

        return [
            { key: 'OVERDUE', value: requestStats.OVERDUE || 0, color: COLORS.OVERDUE, label: STATUS_LABELS.OVERDUE },
            { key: 'PENDING', value: requestStats.PENDING || 0, color: COLORS.PENDING, label: STATUS_LABELS.PENDING },
            { key: 'APPROVED', value: requestStats.APPROVED || 0, color: COLORS.APPROVED, label: STATUS_LABELS.APPROVED },
            { key: 'RETURNING', value: requestStats.RETURNING || 0, color: COLORS.RETURNING, label: STATUS_LABELS.RETURNING },
            { key: 'RETURNED', value: requestStats.RETURNED || 0, color: COLORS.RETURNED, label: STATUS_LABELS.RETURNED },
            { key: 'REJECTED', value: requestStats.REJECTED || 0, color: COLORS.REJECTED, label: STATUS_LABELS.REJECTED },
            { key: 'CANCELLED', value: requestStats.CANCELLED || 0, color: COLORS.CANCELLED, label: STATUS_LABELS.CANCELLED },
        ].filter(item => item.value > 0);
    }, [requestStats]);

    const totalRequests = requestSlices.reduce((sum, item) => sum + item.value, 0) || 1;

    const pieData = requestSlices.map((slice, index) => ({
        value: slice.value,
        color: slice.color,
        key: `pie-${slice.key}-${index}`,
    }));

    const deviceMaintenancePercent = deviceStats
        ? Math.round(((deviceStats.MAINTENANCE || 0) / (deviceStats.total || 1)) * 100)
        : 0;

    const userActivePercent = userStats
        ? Math.round(((userStats.active || 0) / (userStats.total || 1)) * 100)
        : 0;

    if (loading && !userStats) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#334155" />
                <Text style={{ marginTop: 12, color: '#666', fontSize: 14 }}>Đang tải thống kê...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* GRADIENT HEADER */}
            <LinearGradient
                colors={['#1E293B', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <Text style={styles.headerTitle}>Thống kê tổng quan</Text>
                <Text style={styles.headerSubtitle}>Phân tích dữ liệu hệ thống</Text>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#334155']}
                    />
                }
            >
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#34C759' }]}>
                            <Ionicons name="people" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{userStats?.active || 0}</Text>
                        <Text style={styles.statLabel}>User hoạt động</Text>
                        <Text style={styles.statSubLabel}>{userActivePercent}% tổng số</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#FF3B30' }]}>
                            <Ionicons name="lock-closed" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{userStats?.deActive || 0}</Text>
                        <Text style={styles.statLabel}>User bị khóa</Text>
                        <Text style={styles.statSubLabel}>{100 - userActivePercent}% tổng số</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#007AFF' }]}>
                            <MaterialCommunityIcons name="devices" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{deviceStats?.NORMAL || 0}</Text>
                        <Text style={styles.statLabel}>Thiết bị sẵn sàng</Text>
                        <Text style={styles.statSubLabel}>{100 - deviceMaintenancePercent}% tổng số</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#FF9500' }]}>
                            <MaterialCommunityIcons name="wrench" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{deviceStats?.MAINTENANCE || 0}</Text>
                        <Text style={styles.statLabel}>Đang bảo trì</Text>
                        <Text style={styles.statSubLabel}>{deviceMaintenancePercent}% tổng số</Text>
                    </View>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Trạng thái đơn mượn</Text>

                    {pieData.length > 0 ? (
                        <View style={styles.chartContainer}>
                            <View style={styles.pieWrapper}>
                                <PieChart
                                    data={pieData}
                                    donut
                                    radius={90}
                                    innerRadius={60}
                                    innerCircleColor="#FFF"
                                />
                                <View style={styles.pieCenterText}>
                                    <Text style={styles.pieCenterNumber}>{totalRequests}</Text>
                                    <Text style={styles.pieCenterLabel}>Tổng đơn</Text>
                                </View>
                            </View>

                            <View style={styles.legendContainer}>
                                {requestSlices.map(item => (
                                    <View key={item.key} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendText}>{item.label}</Text>
                                        <Text style={styles.legendCount}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyChart}>
                            <MaterialCommunityIcons name="chart-donut" size={64} color="#E0E0E0" />
                            <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
                        </View>
                    )}
                </View>

                {mostBorrowed.length > 0 && (
                    <View style={styles.topDevicesCard}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="trophy" size={24} color="#334155" />
                            <Text style={styles.cardHeaderTitle}>Top thiết bị được mượn nhiều nhất</Text>
                        </View>

                        {mostBorrowed.map((device, index) => (
                            <View key={device._id} style={styles.deviceItem}>
                                <View style={styles.deviceRank}>
                                    <Text style={styles.rankNumber}>#{index + 1}</Text>
                                </View>

                                <View style={styles.deviceImageContainer}>
                                    {device.image_url ? (
                                        <Image
                                            source={{ uri: getImageUrl(device.image_url) }}
                                            style={styles.deviceImage}
                                        />
                                    ) : (
                                        <View style={styles.deviceImagePlaceholder}>
                                            <MaterialCommunityIcons name="devices" size={28} color="#9CA3AF" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.deviceInfo}>
                                    <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
                                    <Text style={styles.deviceCode}>Mã: {device.code}</Text>
                                </View>

                                <View style={styles.deviceCount}>
                                    <Text style={styles.countNumber}>{device.borrow_count}</Text>
                                    <Text style={styles.countLabel}>lượt</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
