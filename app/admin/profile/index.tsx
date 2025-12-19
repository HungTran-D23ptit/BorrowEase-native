import { useToast } from '@/contexts/ToastContext';
import { useAdminLogin } from '@/hooks/admin/useAuth';
import { useAdminProfile } from '@/hooks/admin/useProfile';
import { useStatistics } from '@/hooks/admin/useStatistics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Admin&background=334155&color=fff&size=200&bold=true';

const MENU_ITEMS = [
    {
        id: 1,
        title: 'Trang chủ',
        icon: 'home-outline',
        route: '/admin/home',
        color: '#2196F3',
        bgColor: '#E3F2FD',
    },
    {
        id: 2,
        title: 'Quản lý thiết bị',
        icon: 'phone-portrait-outline',
        route: '/admin/devices',
        color: '#4CAF50',
        bgColor: '#E8F5E9',
    },
    {
        id: 3,
        title: 'Quản lý mượn trả',
        icon: 'swap-horizontal-outline',
        route: '/admin/borrowing',
        color: '#FF9800',
        bgColor: '#FFF3E0',
    },
    {
        id: 4,
        title: 'Thống kê',
        icon: 'stats-chart-outline',
        route: '/admin/Statistical',
        color: '#9C27B0',
        bgColor: '#F3E5F5',
    },
    {
        id: 5,
        title: 'Quản lý người dùng',
        icon: 'people-outline',
        route: '/admin/UserManagement',
        color: '#607D8B',
        bgColor: '#ECEFF1',
    },
    {
        id: 6,
        title: 'Thông báo',
        icon: 'notifications-outline',
        route: '/admin/notifications',
        color: '#00BCD4',
        bgColor: '#E0F7FA',
    },
];

export default function AdminProfile() {
    const router = useRouter();
    const { logout } = useAdminLogin();
    const { profile, loading, refreshing, refresh } = useAdminProfile();
    const { userStats, deviceStats, requestStats, refreshing: statsRefreshing } = useStatistics();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { showWarning } = useToast();

    const handleLogout = async () => {
        setLogoutModalVisible(true);
    };

    const handleMenuPress = (item: any) => {
        router.push(item.route as any);
    };

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.replace('/auth/login' as any);
        } catch (error) {
            router.replace('/auth/login' as any);
        } finally {
            setIsLoggingOut(false);
            setLogoutModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1E293B', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <Text style={styles.headerTitle}>Cá nhân</Text>
                <Text style={styles.headerSubtitle}>Quản lý thông tin tài khoản</Text>
            </LinearGradient>

            {loading && !profile ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#334155" />
                    <Text style={{ marginTop: 12, color: '#666', fontSize: 14 }}>Đang tải thông tin...</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refresh}
                            colors={['#334155']}
                            tintColor="#334155"
                        />
                    }
                >

                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{
                                    uri: profile?.avatar || DEFAULT_AVATAR
                                }}
                                style={styles.avatarImage}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.profileName}>{profile?.name || 'Quản trị viên'}</Text>
                        <Text style={styles.profileEmail}>{profile?.email || 'admin@borrowease.com'}</Text>
                        <Text style={styles.profileRole}>
                            {profile?.role === 'admin' ? 'Administrator' : 'Admin'}
                        </Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {deviceStats?.total || 0}
                            </Text>
                            <Text style={styles.statLabel}>Thiết bị</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {requestStats?.APPROVED || 0}
                            </Text>
                            <Text style={styles.statLabel}>Đang mượn</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {userStats?.total || 0}
                            </Text>
                            <Text style={styles.statLabel}>Người dùng</Text>
                        </View>
                    </View>

                    <View style={styles.menuSection}>
                        {MENU_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handleMenuPress(item)}
                            >
                                <View style={[styles.menuIcon, { backgroundColor: item.bgColor }]}>
                                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <Text style={styles.menuText}>{item.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#CCC" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialCommunityIcons name="logout" size={22} color="#F44336" />
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>

                    <View style={styles.versionContainer}>
                        <Text style={styles.versionText}>BorrowEase Admin v1.0.0</Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}

            {/* LOGOUT CONFIRMATION MODAL */}
            <Modal
                visible={logoutModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: '#FFF', borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}>
                        <View style={{ padding: 24, alignItems: 'center' }}>
                            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                <MaterialCommunityIcons name="logout" size={40} color="#F44336" />
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 12, textAlign: 'center' }}>Đăng xuất</Text>
                            <Text style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
                                Bạn có chắc chắn muốn đăng xuất?
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 12, padding: 16 }}>
                            <TouchableOpacity
                                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => setLogoutModalVisible(false)}
                                disabled={isLoggingOut}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F44336', alignItems: 'center', justifyContent: 'center' }}
                                onPress={confirmLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Đăng xuất</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}