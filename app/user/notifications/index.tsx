import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useToast } from '../../../contexts/ToastContext';
import { useNotificationActions, useNotifications } from '../../../hooks/user/useNotifications';
import { styles } from './styles';

type NotificationType = 'APPROVED' | 'REMINDER' | 'OVERDUE' | 'REJECTED';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    related_id?: string;
    related_type?: string;
    createdAt: string;
}

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'APPROVED':
            return '✅';
        case 'REMINDER':
            return '⏰';
        case 'OVERDUE':
            return '⚠️';
        case 'REJECTED':
            return '❌';
        default:
            return '🔔';
    }
};

const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, loading, refreshing, refresh, loadMore } = useNotifications();
    const { markAsRead, markAllAsRead } = useNotificationActions();
    const { showSuccess, showError } = useToast();

    const handleNotificationPress = async (notification: Notification) => {
        try {
            // Navigate đến trang liên quan nếu có
            if (notification.related_type === 'BORROW_REQUEST' && notification.related_id) {
                router.push(`/ user / management / detail / ${notification.related_id} ` as any);
            }

            // Đánh dấu đã đọc nếu chưa đọc (không cần refresh ngay)
            if (!notification.is_read) {
                markAsRead(notification._id).catch(err => {
                    console.error('Error marking as read:', err);
                });
            }
        } catch (error) {
            console.error('Error handling notification press:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const response = await markAllAsRead();
            showSuccess(response.message || 'Đã đánh dấu tất cả là đã đọc');
            refresh();
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể đánh dấu đã đọc');
        }
    };

    const renderItem = ({ item }: { item: Notification }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNotificationPress(item)}
                style={[styles.card, item.is_read && styles.cardRead]}
            >
                <View style={styles.leftCol}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>{getNotificationIcon(item.type)}</Text>
                    </View>
                </View>

                <View style={styles.middleCol}>
                    <Text style={[styles.title, item.is_read && styles.titleRead]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={[styles.message, item.is_read && styles.messageRead]} numberOfLines={2}>
                        {item.message}
                    </Text>
                </View>

                <View style={styles.rightCol}>
                    <Text style={[styles.timeText, item.is_read && styles.timeTextRead]}>
                        {getTimeAgo(item.createdAt)}
                    </Text>
                    {!item.is_read && <View style={styles.unreadDot} />}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#334155" />
                    <Text style={styles.emptyText}>Đang tải...</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={64} color="#CCC" />
                <Text style={styles.emptyText}>Không có thông báo</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (!loading || notifications.length === 0) return null;
        return (
            <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color="#334155" />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#334155', '#475569']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Thông báo</Text>
                    <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
                        <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <FlatList
                data={notifications}
                keyExtractor={i => i._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#334155']}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    );
}
