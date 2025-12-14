import { useToast } from '@/contexts/ToastContext';
import { useAdminLogin } from '@/hooks/admin/useAuth';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const MENU_ITEMS = [
    {
        id: 1,
        title: 'Thông tin cá nhân',
        icon: 'person-outline',
        iconType: 'ionicons',
        color: '#2196F3',
        bgColor: '#E3F2FD',
    },
    {
        id: 2,
        title: 'Bảo mật',
        icon: 'shield-checkmark-outline',
        iconType: 'ionicons',
        color: '#4CAF50',
        bgColor: '#E8F5E9',
    },
    {
        id: 3,
        title: 'Thông báo',
        icon: 'notifications-outline',
        iconType: 'ionicons',
        color: '#FF9800',
        bgColor: '#FFF3E0',
    },
    {
        id: 4,
        title: 'Nhật ký hoạt động',
        icon: 'time-outline',
        iconType: 'ionicons',
        color: '#9C27B0',
        bgColor: '#F3E5F5',
    },
    {
        id: 5,
        title: 'Cài đặt hệ thống',
        icon: 'settings-outline',
        iconType: 'ionicons',
        color: '#607D8B',
        bgColor: '#ECEFF1',
    },
    {
        id: 6,
        title: 'Trợ giúp & Hỗ trợ',
        icon: 'help-circle-outline',
        iconType: 'ionicons',
        color: '#00BCD4',
        bgColor: '#E0F7FA',
    },
];

export default function AdminProfile() {
    const router = useRouter();
    const { logout } = useAdminLogin();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { showWarning } = useToast();

    const handleLogout = async () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.replace('/auth/login');
        } catch (error) {
            router.replace('/auth/login');
        } finally {
            setIsLoggingOut(false);
            setLogoutModalVisible(false);
        }
    };

    const handleMenuPress = (item: any) => {
        showWarning('Tính năng đang được phát triển');
    };

    return (
        <View style={styles.container}>
            {/* GRADIENT HEADER */}
            <LinearGradient
                colors={['#1E293B', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <Text style={styles.headerTitle}>Cá nhân</Text>
                <Text style={styles.headerSubtitle}>Quản lý thông tin tài khoản</Text>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/120x120?text=Admin' }}
                            style={styles.avatarImage}
                        />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>Quản trị viên</Text>
                    <Text style={styles.profileEmail}>admin@borrowease.com</Text>
                    <Text style={styles.profileRole}>Administrator</Text>
                </View>

                {/* STATS */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>156</Text>
                        <Text style={styles.statLabel}>Thiết bị</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>42</Text>
                        <Text style={styles.statLabel}>Đang mượn</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>89</Text>
                        <Text style={styles.statLabel}>Người dùng</Text>
                    </View>
                </View>

                {/* MENU ITEMS */}
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

                {/* LOGOUT BUTTON */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={22} color="#F44336" />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>BorrowEase Admin v1.0.0</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

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
