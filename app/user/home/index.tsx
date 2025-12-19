import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DeviceCard from '../../../components/DeviceCard';
import { getImageUrl } from '../../../services/rootApi';
import * as borrowRequestService from '../../../services/user/borrowRequest.service';
import * as deviceService from '../../../services/user/device.service';
import * as profileService from '../../../services/user/profile.service';
import { styles } from './styles';

export default function HomeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [borrowingDevices, setBorrowingDevices] = useState<any[]>([]);
    const [overdueDevices, setOverdueDevices] = useState<any[]>([]);
    const [recommendedDevices, setRecommendedDevices] = useState<any[]>([]);

    const fetchData = async (isRefresh: boolean = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const [profileRes, borrowingRes, overdueRes, recommendedRes] = await Promise.all([
                profileService.getUserProfile(),
                borrowRequestService.getBorrowingDevices({ per_page: 5 }),
                borrowRequestService.getOverdueDevices({ per_page: 5 }),
                deviceService.getRecommendedDevices(),
            ]);

            setUserProfile(profileRes);
            setBorrowingDevices(borrowingRes.borrowings || []);
            setOverdueDevices(overdueRes.overdue || []);
            setRecommendedDevices(recommendedRes.devices || []);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        fetchData(true);
    };

    const calculateDaysLeft = (returnDate: string) => {
        const today = new Date();
        const returnDay = new Date(returnDate);
        const diffTime = returnDay.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#334155" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    const upcomingDeadlines = [...borrowingDevices, ...overdueDevices]
        .sort((a, b) => new Date(a.return_date).getTime() - new Date(b.return_date).getTime())
        .slice(0, 3);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#334155']}
                />
            }
        >
            {/* GRADIENT HEADER */}
            <LinearGradient
                colors={['#334155', '#475569']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            {userProfile?.avatar ? (
                                <Image
                                    source={{ uri: getImageUrl(userProfile.avatar) }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>
                                        {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.userTextContainer}>
                            <Text style={styles.greetingText}>Xin chào,</Text>
                            <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => router.push('/user/notifications' as any)}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                        {/* Badge for unread notifications */}
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* STATS CARDS */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconCircle}>
                            <MaterialCommunityIcons name="package-variant" size={20} color="#334155" />
                        </View>
                        <Text style={styles.statValue}>{borrowingDevices.length}</Text>
                        <Text style={styles.statLabel}>Đang mượn</Text>
                    </View>
                    <View style={[styles.statCard, styles.statCardDanger]}>
                        <View style={[styles.statIconCircle, styles.statIconCircleDanger]}>
                            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                        </View>
                        <Text style={styles.statValue}>{overdueDevices.length}</Text>
                        <Text style={styles.statLabel}>Quá hạn</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* QUICK ACTIONS */}
            <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => router.push('/user/explore' as any)}
                >
                    <View style={styles.quickActionIcon}>
                        <Ionicons name="laptop-outline" size={24} color="#334155" />
                    </View>
                    <Text style={styles.quickActionText}>Mượn thiết bị</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => router.push('/user/management' as any)}
                >
                    <View style={styles.quickActionIcon}>
                        <Ionicons name="list" size={24} color="#34C759" />
                    </View>
                    <Text style={styles.quickActionText}>Quản lý đơn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => router.push('/user/profile' as any)}
                >
                    <View style={styles.quickActionIcon}>
                        <Ionicons name="person" size={24} color="#FF9500" />
                    </View>
                    <Text style={styles.quickActionText}>Tài khoản</Text>
                </TouchableOpacity>
            </View>

            {/* SẮP ĐẾN HẠN TRẢ */}
            {upcomingDeadlines.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Sắp đến hạn trả</Text>
                        <TouchableOpacity onPress={() => router.push('/user/management' as any)}>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.deadlineContainer}>
                        {upcomingDeadlines.map((item, index) => {
                            const daysLeft = calculateDaysLeft(item.return_date);
                            const isOverdue = daysLeft < 0;
                            const backgroundColor = isOverdue
                                ? '#FFEBEE'
                                : index % 2 === 0
                                    ? '#E3F2FD'
                                    : '#F3E5F5';

                            return (
                                <TouchableOpacity
                                    key={item._id}
                                    style={styles.deadlineItem}
                                    onPress={() => router.push('/user/management' as any)}
                                >
                                    <View style={styles.timelineWrapper}>
                                        <View
                                            style={[
                                                styles.timelineDot,
                                                { backgroundColor: isOverdue ? '#FF3B30' : '#334155' },
                                            ]}
                                        />
                                        {index < upcomingDeadlines.length - 1 && (
                                            <View style={styles.timelineLine} />
                                        )}
                                    </View>
                                    <View style={[styles.deadlineContent, { backgroundColor }]}>
                                        <View style={styles.deadlineHeader}>
                                            <Text style={styles.deadlineDevice}>
                                                {item.device?.name || 'Thiết bị'}
                                            </Text>
                                            {isOverdue && (
                                                <View style={styles.overdueBadge}>
                                                    <Text style={styles.overdueBadgeText}>Quá hạn</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.deadlineDays}>
                                            {isOverdue
                                                ? `Quá hạn ${Math.abs(daysLeft)} ngày`
                                                : daysLeft === 0
                                                    ? 'Hết hạn hôm nay'
                                                    : `Còn ${daysLeft} ngày`}
                                        </Text>
                                        <Text style={styles.deadlineDate}>
                                            Hạn trả: {new Date(item.return_date).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* THIẾT BỊ ĐỀ XUẤT */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Thiết bị đề xuất cho bạn</Text>
                    <TouchableOpacity onPress={() => router.push('/user/explore' as any)}>
                        <Text style={styles.seeAllText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>

                {recommendedDevices.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="inbox-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Chưa có thiết bị đề xuất</Text>
                    </View>
                ) : (
                    <View style={styles.deviceGrid}>
                        {recommendedDevices.map((device) => (
                            <DeviceCard key={device._id} device={device} />
                        ))}
                    </View>
                )}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}
