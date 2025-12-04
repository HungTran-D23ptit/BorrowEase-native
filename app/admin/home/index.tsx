import { useAdminLogin } from '@/hooks/admin/useAuth';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

// Mock data cho thống kê
const STATS_DATA = [
  { id: 1, title: 'Tổng thiết bị', value: '156', icon: 'devices', color: '#4CAF50', bgColor: '#E8F5E9' },
  { id: 2, title: 'Đang mượn', value: '42', icon: 'hand-back-right', color: '#2196F3', bgColor: '#E3F2FD' },
  { id: 3, title: 'Sắp hết hạn', value: '8', icon: 'clock-alert-outline', color: '#FF9800', bgColor: '#FFF3E0' },
  { id: 4, title: 'Quá hạn', value: '3', icon: 'alert-circle', color: '#F44336', bgColor: '#FFEBEE' },
];

// Mock data cho hoạt động gần đây
const RECENT_ACTIVITIES = [
  { id: 1, user: 'Nguyễn Văn A', action: 'Mượn', device: 'Canon EOS R5', time: '10 phút trước', type: 'borrow' },
  { id: 2, user: 'Trần Thị B', action: 'Trả', device: 'Sony A7 III', time: '25 phút trước', type: 'return' },
  { id: 3, user: 'Lê Văn C', action: 'Mượn', device: 'DJI Gimbal', time: '1 giờ trước', type: 'borrow' },
];

export default function AdminHome() {
  const router = useRouter();
  const { logout } = useAdminLogin();

  const handleLogout = async () => {
    logout();
    router.replace('/auth/LoginScreen');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100x100?text=A' }}
              style={styles.avatarImage}
            />
          </View>
          <View>
            <Text style={styles.greetingText}>Xin chào Admin</Text>
            <Text style={styles.userName}>Quản trị viên</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#FF6B35" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* THỐNG KÊ NHANH */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
        <View style={styles.statsGrid}>
          {STATS_DATA.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                <MaterialCommunityIcons name={stat.icon as any} size={28} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* QUẢN LÝ NHANH */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quản lý nhanh</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/admin/devices')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="devices" size={32} color="#2196F3" />
            </View>
            <Text style={styles.quickActionTitle}>Quản lý thiết bị</Text>
            <Text style={styles.quickActionDesc}>Xem và chỉnh sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="people" size={32} color="#9C27B0" />
            </View>
            <Text style={styles.quickActionTitle}>Người dùng</Text>
            <Text style={styles.quickActionDesc}>Quản lý tài khoản</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="chart-line" size={32} color="#FF9800" />
            </View>
            <Text style={styles.quickActionTitle}>Báo cáo</Text>
            <Text style={styles.quickActionDesc}>Thống kê chi tiết</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="settings" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionTitle}>Cài đặt</Text>
            <Text style={styles.quickActionDesc}>Cấu hình hệ thống</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HOẠT ĐỘNG GẦN ĐÂY */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {RECENT_ACTIVITIES.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[
              styles.activityIcon,
              { backgroundColor: activity.type === 'borrow' ? '#E3F2FD' : '#E8F5E9' }
            ]}>
              <MaterialCommunityIcons
                name={activity.type === 'borrow' ? 'arrow-up-bold' : 'arrow-down-bold'}
                size={20}
                color={activity.type === 'borrow' ? '#2196F3' : '#4CAF50'}
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityUser}>{activity.user}</Text>
              <Text style={styles.activityDesc}>
                {activity.action} <Text style={styles.activityDevice}>{activity.device}</Text>
              </Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
