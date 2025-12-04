import { useAdminLogin } from '@/hooks/admin/useAuth';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

    const handleLogout = async () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/auth/LoginScreen');
                    },
                },
            ]
        );
    };

    const handleMenuPress = (item: any) => {
        Alert.alert(item.title, 'Tính năng đang được phát triển');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cá nhân</Text>
            </View>

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
    );
}
