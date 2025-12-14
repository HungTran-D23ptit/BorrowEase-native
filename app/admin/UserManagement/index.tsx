import { useToast } from '@/contexts/ToastContext';
import { useUserActions, useUsers, useUserStats } from '@/hooks/admin/useUsers';
import { getImageUrl } from '@/services/rootApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { s } from './styles';

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        visible: boolean;
        user: any;
        action: string;
    }>({ visible: false, user: null, action: '' });
    const { showSuccess, showError, showWarning } = useToast();

    const { users, loading, refreshing, refresh, loadMore } = useUsers();
    const { stats } = useUserStats();
    const { deleteUser, activateUser, loading: actionLoading } = useUserActions();

    function onToggleExpand(id: string) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    function onToggleLock(user: any) {
        const isLocked = user.status === 'DE_ACTIVE';
        const action = isLocked ? 'mở khóa' : 'khóa';
        setConfirmModal({ visible: true, user, action });
    }

    async function handleConfirmToggleLock() {
        const { user, action } = confirmModal;
        if (!user) return;

        const isLocked = user.status === 'DE_ACTIVE';

        try {
            if (isLocked) {
                await activateUser(user._id);
                showSuccess(`Đã mở khóa tài khoản ${user.name} thành công`);
            } else {
                await deleteUser(user._id);
                showSuccess(`Đã khóa tài khoản ${user.name} thành công`);
            }
            setTimeout(() => {
                refresh();
            }, 500);
        } catch (error) {
            console.error('Toggle lock error:', error);
            showError(`Không thể ${action} tài khoản`);
        }
    }

    const filtered = users.filter(u =>
        `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase()),
    );

    const activePercent = stats ? Math.round((stats.active / stats.total) * 100) : 0;

    return (
        <View style={s.container}>
            {/* HEADER WITH GRADIENT */}
            <LinearGradient
                colors={['#1E293B', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.headerGradient}
            >
                <Text style={s.headerTitle}>Quản lý người dùng</Text>
                <Text style={s.headerSubtitle}>
                    {stats?.total || 0} người dùng trong hệ thống
                </Text>
            </LinearGradient>

            {/* STATS CARDS */}
            <View style={s.statsContainer}>
                <View style={[s.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <View style={[s.statIconCircle, { backgroundColor: '#34C759' }]}>
                        <MaterialCommunityIcons name="account-check" size={24} color="#FFF" />
                    </View>
                    <Text style={s.statValue}>{stats?.active || 0}</Text>
                    <Text style={s.statLabel}>Hoạt động</Text>
                </View>

                <View style={[s.statCard, { backgroundColor: '#FFEBEE' }]}>
                    <View style={[s.statIconCircle, { backgroundColor: '#FF3B30' }]}>
                        <MaterialCommunityIcons name="account-off" size={24} color="#FFF" />
                    </View>
                    <Text style={s.statValue}>{stats?.deActive || 0}</Text>
                    <Text style={s.statLabel}>Bị khóa</Text>
                </View>

                <View style={[s.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <View style={[s.statIconCircle, { backgroundColor: '#007AFF' }]}>
                        <MaterialCommunityIcons name="account-group" size={24} color="#FFF" />
                    </View>
                    <Text style={s.statValue}>{activePercent}%</Text>
                    <Text style={s.statLabel}>Tỷ lệ hoạt động</Text>
                </View>
            </View>

            {/* SEARCH */}
            <View style={s.searchSection}>
                <View style={s.searchRow}>
                    <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    <TextInput
                        placeholder="Tìm kiếm theo tên, email, SĐT..."
                        placeholderTextColor="#9CA3AF"
                        value={search}
                        onChangeText={setSearch}
                        style={s.searchInput}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* USER LIST */}
            {loading && users.length === 0 ? (
                <View style={s.loadingContainer}>
                    <ActivityIndicator size="large" color="#34C759" />
                    <Text style={s.loadingText}>Đang tải người dùng...</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item._id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#334155']} />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={s.listContent}
                    renderItem={({ item }) => {
                        const isExpanded = expandedId === item._id;
                        const isLocked = item.status === 'DE_ACTIVE';

                        return (
                            <View style={s.userCard}>
                                <TouchableOpacity
                                    style={s.cardHeader}
                                    onPress={() => onToggleExpand(item._id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={s.userInfo}>
                                        {(item.avatar_url || item.avatar || item.image_url) ? (
                                            <Image
                                                source={{ uri: getImageUrl(item.avatar_url || item.avatar || item.image_url) }}
                                                style={s.avatar}
                                            />
                                        ) : (
                                            <View style={s.avatarPlaceholder}>
                                                <MaterialCommunityIcons name="account" size={28} color="#9CA3AF" />
                                            </View>
                                        )}
                                        <View style={s.userTextContainer}>
                                            <Text style={s.userName} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text style={s.userEmail} numberOfLines={1}>
                                                {item.email}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={s.cardActions}>
                                        {isLocked ? (
                                            <View style={s.statusBadgeLocked}>
                                                <MaterialCommunityIcons name="lock" size={14} color="#FF3B30" />
                                                <Text style={s.statusTextLocked}>Đã khóa</Text>
                                            </View>
                                        ) : (
                                            <View style={s.statusBadgeActive}>
                                                <MaterialCommunityIcons name="check-circle" size={14} color="#34C759" />
                                                <Text style={s.statusTextActive}>Hoạt động</Text>
                                            </View>
                                        )}
                                        <Ionicons
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color="#9CA3AF"
                                            style={{ marginLeft: 8 }}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={s.expandedContent}>
                                        <View style={s.detailRow}>
                                            <MaterialCommunityIcons name="phone" size={16} color="#6B7280" />
                                            <Text style={s.detailLabel}>Số điện thoại:</Text>
                                            <Text style={s.detailValue}>{item.phone || 'N/A'}</Text>
                                        </View>

                                        <View style={s.detailRow}>
                                            <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                                            <Text style={s.detailLabel}>Địa chỉ:</Text>
                                            <Text style={s.detailValue} numberOfLines={2}>
                                                {item.address || 'N/A'}
                                            </Text>
                                        </View>

                                        <View style={s.detailRow}>
                                            <MaterialCommunityIcons name="shield-account" size={16} color="#6B7280" />
                                            <Text style={s.detailLabel}>Vai trò:</Text>
                                            <Text style={s.detailValue}>{item.role || 'USER'}</Text>
                                        </View>

                                        <TouchableOpacity
                                            style={[s.lockButton, isLocked && s.unlockButton]}
                                            onPress={() => onToggleLock(item)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <ActivityIndicator size="small" color="#FFF" />
                                            ) : (
                                                <>
                                                    <Ionicons
                                                        name={isLocked ? 'lock-open' : 'lock-closed'}
                                                        size={18}
                                                        color="#FFF"
                                                    />
                                                    <Text style={s.lockButtonText}>
                                                        {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={s.emptyContainer}>
                            <MaterialCommunityIcons name="account-search" size={80} color="#E0E0E0" />
                            <Text style={s.emptyText}>Không tìm thấy người dùng</Text>
                            <Text style={s.emptySubtext}>
                                {search ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có người dùng nào'}
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        loading && users.length > 0 ? (
                            <ActivityIndicator size="small" color="#34C759" style={{ marginVertical: 20 }} />
                        ) : null
                    }
                />
            )}

            {/* CONFIRMATION MODAL */}
            <Modal
                visible={confirmModal.visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setConfirmModal({ visible: false, user: null, action: '' })}
            >
                <View style={s.modalOverlay}>
                    <View style={s.modalContainer}>
                        <View style={s.modalHeader}>
                            <View
                                style={[
                                    s.modalIconCircle,
                                    {
                                        backgroundColor:
                                            confirmModal.action === 'khóa' ? '#FFEBEE' : '#E8F5E9',
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={confirmModal.action === 'khóa' ? 'lock-closed' : 'lock-open'}
                                    size={32}
                                    color={confirmModal.action === 'khóa' ? '#FF3B30' : '#34C759'}
                                />
                            </View>
                            <Text style={s.modalTitle}>
                                {confirmModal.action === 'khóa' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            </Text>
                            <Text style={s.modalMessage}>
                                Bạn có chắc chắn muốn {confirmModal.action} tài khoản{' '}
                                <Text style={s.modalUserName}>{confirmModal.user?.name}</Text>?
                            </Text>
                        </View>

                        <View style={s.modalActions}>
                            <TouchableOpacity
                                style={s.modalCancelButton}
                                onPress={() => setConfirmModal({ visible: false, user: null, action: '' })}
                                disabled={actionLoading}
                            >
                                <Text style={s.modalCancelText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    s.modalConfirmButton,
                                    {
                                        backgroundColor:
                                            confirmModal.action === 'khóa' ? '#FF3B30' : '#34C759',
                                    },
                                ]}
                                onPress={async () => {
                                    await handleConfirmToggleLock();
                                    setConfirmModal({ visible: false, user: null, action: '' });
                                }}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={s.modalConfirmText}>Xác nhận</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
