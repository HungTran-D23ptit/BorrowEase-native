import { useToast } from '@/contexts/ToastContext';
import { useNotificationActions, useNotifications } from '@/hooks/admin/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from './styles';

const NOTIFICATION_TYPES = {
    APPROVED: { icon: 'checkmark-circle', color: '#34C759', label: 'Đã duyệt' },
    REJECTED: { icon: 'close-circle', color: '#FF3B30', label: 'Từ chối' },
    REMINDER: { icon: 'time', color: '#FF9500', label: 'Nhắc nhở' },
    OVERDUE: { icon: 'alert-circle', color: '#FF3B30', label: 'Quá hạn' },
    GENERAL: { icon: 'notifications', color: '#007AFF', label: 'Thông báo' },
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, loading, refreshing, refresh, loadMore } = useNotifications();
    const { markAsRead, markAllAsRead, deleteNotification } = useNotificationActions();
    const [deleteModal, setDeleteModal] = useState<{ visible: boolean; notification: any | null }>({ visible: false, notification: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const { showWarning } = useToast();

    const handleNotificationPress = async (notification: any) => {
        if (!notification.is_read) {
            await markAsRead(notification._id);
            refresh();
        }

        if (notification.related_type === 'BORROW_REQUEST' && notification.related_id) {
            router.push(`/admin/borrowing?requestId=${notification.related_id}` as any);
        }
    };

    const handleMarkAllRead = async () => {
        const unreadCount = notifications.filter(n => !n.is_read).length;
        if (unreadCount === 0) {
            showWarning('Tất cả thông báo đã được đọc');
            return;
        }

        const success = await markAllAsRead();
        if (success) {
            refresh();
        }
    };

    const handleDelete = (notification: any) => {
        setDeleteModal({ visible: true, notification });
    };

    const confirmDelete = async () => {
        if (!deleteModal.notification) return;

        setIsDeleting(true);
        const success = await deleteNotification(deleteModal.notification._id);
        if (success) {
            refresh();
        }
        setIsDeleting(false);
        setDeleteModal({ visible: false, notification: null });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const renderItem = ({ item }: { item: any }) => {
        const typeConfig = NOTIFICATION_TYPES[item.type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.GENERAL;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleNotificationPress(item)}
                style={styles.card}
            >
                <View style={styles.leftCol}>
                    <View style={[styles.iconCircle, { backgroundColor: typeConfig.color + '20' }]}>
                        <Ionicons name={typeConfig.icon as any} size={24} color={typeConfig.color} />
                    </View>
                </View>

                <View style={styles.middleCol}>
                    <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.message} numberOfLines={2}>
                        {item.message}
                    </Text>
                </View>

                <View style={styles.rightCol}>
                    <Text style={styles.timeText}>
                        {formatTime(item.createdAt)}
                    </Text>
                    {!item.is_read && <View style={styles.unreadDot} />}
                    <TouchableOpacity
                        onPress={() => handleDelete(item)}
                        style={{ marginTop: 8, padding: 4 }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={18} color="#999" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
                    <Ionicons name="checkmark-done" size={16} color="#FFF" style={{ marginRight: 5 }} />
                    <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={i => i._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#334155']}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    loading ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#334155" />
                            <Text style={{ marginTop: 12, color: '#666' }}>Đang tải...</Text>
                        </View>
                    ) : (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Ionicons name="notifications-off-outline" size={64} color="#CCC" />
                            <Text style={styles.empty}>Không có thông báo.</Text>
                        </View>
                    )
                }
            />

            {/* DELETE CONFIRMATION MODAL */}
            <Modal
                visible={deleteModal.visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDeleteModal({ visible: false, notification: null })}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#FFF', borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}>
                        <View style={{ padding: 24, alignItems: 'center' }}>
                            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                <Ionicons name="trash" size={40} color="#F44336" />
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 12, textAlign: 'center' }}>Xóa thông báo</Text>
                            <Text style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
                                Bạn có chắc muốn xóa thông báo này?
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 12, padding: 16 }}>
                            <TouchableOpacity
                                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => setDeleteModal({ visible: false, notification: null })}
                                disabled={isDeleting}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F44336', alignItems: 'center', justifyContent: 'center' }}
                                onPress={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Xóa</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
