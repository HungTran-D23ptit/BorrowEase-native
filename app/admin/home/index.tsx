import { useAdminLogin } from '@/hooks/admin/useAuth';
import { useStatistics } from '@/hooks/admin/useStatistics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import NotificationBell from '../../../components/admin/NotificationBell';
import { styles } from './styles';

export default function AdminHome() {
  const router = useRouter();
  const { logout } = useAdminLogin();
  const { userStats, deviceStats, requestStats, loading, refreshing, refresh } = useStatistics();

  const handleLogout = async () => {
    logout();
    router.replace('/auth/LoginScreen' as any);
  };

  const totalRequests = requestStats
    ? Object.values(requestStats).reduce((sum: number, val) => sum + (val as number), 0)
    : 0;

  const quickActions = [
    {
      id: 1,
      title: 'Quản lý thiết bị',
      icon: 'devices',
      iconType: 'material',
      color: '#007AFF',
      bgColor: '#E3F2FD',
      route: '/admin/devices',
      count: deviceStats?.total || 0,
      label: 'thiết bị'
    },
    {
      id: 2,
      title: 'Đơn mượn',
      icon: 'swap-horizontal-circle',
      iconType: 'material',
      color: '#334155',
      bgColor: '#FFE8E0',
      route: '/admin/borrowing',
      count: requestStats?.PENDING || 0,
      label: 'chờ duyệt'
    },
    {
      id: 3,
      title: 'Người dùng',
      icon: 'people',
      iconType: 'ionicons',
      color: '#34C759',
      bgColor: '#E8F5E9',
      route: '/admin/UserManagement',
      count: userStats?.total || 0,
      label: 'người dùng'
    },
    {
      id: 4,
      title: 'Thống kê',
      icon: 'stats-chart',
      iconType: 'ionicons',
      color: '#5856D6',
      bgColor: '#EDE7F6',
      route: '/admin/Statistical',
      count: totalRequests,
      label: 'tổng đơn'
    },
  ];

  const statusCards = [
    {
      id: 1,
      title: 'Chờ duyệt',
      value: requestStats?.PENDING || 0,
      icon: 'time-outline',
      color: '#FF9500',
      bgColor: '#FFF3E0',
    },
    {
      id: 2,
      title: 'Đang mượn',
      value: requestStats?.APPROVED || 0,
      icon: 'checkmark-circle-outline',
      color: '#007AFF',
      bgColor: '#E3F2FD',
    },
    {
      id: 3,
      title: 'Quá hạn',
      value: requestStats?.OVERDUE || 0,
      icon: 'alert-circle-outline',
      color: '#FF3B30',
      bgColor: '#FFEBEE',
    },
    {
      id: 4,
      title: 'Đã trả',
      value: requestStats?.RETURNED || 0,
      icon: 'checkmark-done-outline',
      color: '#34C759',
      bgColor: '#E8F5E9',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={['#334155']}
        />
      }
    >
      {/* HEADER WITH GRADIENT */}
      <LinearGradient
        colors={['#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="shield-account" size={32} color="#FFF" />
            </View>
            <View>
              <Text style={styles.greetingText}>Xin chào Admin</Text>
              <Text style={styles.userName}>Quản trị viên hệ thống</Text>
            </View>
          </View>
          <NotificationBell />
        </View>

        {/* STATS OVERVIEW IN HEADER */}
        <View style={styles.headerStats}>
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{userStats?.total || 0}</Text>
            <Text style={styles.headerStatLabel}>Người dùng</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{deviceStats?.total || 0}</Text>
            <Text style={styles.headerStatLabel}>Thiết bị</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{totalRequests}</Text>
            <Text style={styles.headerStatLabel}>Tổng đơn</Text>
          </View>
        </View>
      </LinearGradient>

      {/* STATUS CARDS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trạng thái đơn mượn</Text>
        <View style={styles.statusGrid}>
          {statusCards.map((card) => (
            <View key={card.id} style={[styles.statusCard, { backgroundColor: card.bgColor }]}>
              <View style={[styles.statusIconCircle, { backgroundColor: card.color }]}>
                <Ionicons name={card.icon as any} size={24} color="#FFF" />
              </View>
              <Text style={styles.statusValue}>{card.value}</Text>
              <Text style={styles.statusLabel}>{card.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quản lý nhanh</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                {action.iconType === 'material' ? (
                  <MaterialCommunityIcons name={action.icon as any} size={32} color={action.color} />
                ) : (
                  <Ionicons name={action.icon as any} size={32} color={action.color} />
                )}
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <View style={styles.quickActionBadge}>
                <Text style={styles.quickActionCount}>{action.count}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SYSTEM INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin hệ thống</Text>
        <View style={styles.systemCard}>
          <View style={styles.systemRow}>
            <View style={styles.systemIconWrapper}>
              <MaterialCommunityIcons name="account-check" size={24} color="#34C759" />
            </View>
            <View style={styles.systemInfo}>
              <Text style={styles.systemLabel}>User hoạt động</Text>
              <Text style={styles.systemValue}>{userStats?.active || 0} / {userStats?.total || 0}</Text>
            </View>
            <View style={styles.systemPercentBadge}>
              <Text style={styles.systemPercent}>
                {userStats ? Math.round((userStats.active / userStats.total) * 100) : 0}%
              </Text>
            </View>
          </View>

          <View style={styles.systemDivider} />

          <View style={styles.systemRow}>
            <View style={styles.systemIconWrapper}>
              <MaterialCommunityIcons name="devices" size={24} color="#007AFF" />
            </View>
            <View style={styles.systemInfo}>
              <Text style={styles.systemLabel}>Thiết bị sẵn sàng</Text>
              <Text style={styles.systemValue}>{deviceStats?.NORMAL || 0} / {deviceStats?.total || 0}</Text>
            </View>
            <View style={styles.systemPercentBadge}>
              <Text style={styles.systemPercent}>
                {deviceStats ? Math.round((deviceStats.NORMAL / deviceStats.total) * 100) : 0}%
              </Text>
            </View>
          </View>

          <View style={styles.systemDivider} />

          <View style={styles.systemRow}>
            <View style={styles.systemIconWrapper}>
              <MaterialCommunityIcons name="wrench" size={24} color="#FF9500" />
            </View>
            <View style={styles.systemInfo}>
              <Text style={styles.systemLabel}>Đang bảo trì</Text>
              <Text style={styles.systemValue}>{deviceStats?.MAINTENANCE || 0} thiết bị</Text>
            </View>
            {deviceStats && deviceStats.MAINTENANCE > 0 && (
              <View style={[styles.systemPercentBadge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.systemPercent, { color: '#FF9500' }]}>!</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
