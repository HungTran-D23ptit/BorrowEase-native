import { useDeviceDetail } from '@/hooks/user/useDevices';
import { getImageUrl } from '@/services/rootApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { detailStyles as styles } from './detailStyles';

const STATUS_CONFIG = {
  available: { label: 'Sẵn sàng', color: '#10B981', bgColor: '#D1FAE5', icon: 'checkmark-circle' },
  borrowed: { label: 'Đang mượn', color: '#3B82F6', bgColor: '#DBEAFE', icon: 'time' },
  maintenance: { label: 'Bảo trì', color: '#F59E0B', bgColor: '#FEF3C7', icon: 'construct' },
  unavailable: { label: 'Không khả dụng', color: '#EF4444', bgColor: '#FEE2E2', icon: 'close-circle' },
  NORMAL: { label: 'Sẵn sàng', color: '#10B981', bgColor: '#D1FAE5', icon: 'checkmark-circle' },
  BORROWED: { label: 'Đang mượn', color: '#3B82F6', bgColor: '#DBEAFE', icon: 'time' },
  MAINTENANCE: { label: 'Bảo trì', color: '#F59E0B', bgColor: '#FEF3C7', icon: 'construct' },
  UNAVAILABLE: { label: 'Không khả dụng', color: '#EF4444', bgColor: '#FEE2E2', icon: 'close-circle' },
};

const BORROW_STATUS_CONFIG = {
  pending: { label: 'Chờ duyệt', color: '#F59E0B' },
  approved: { label: 'Đã duyệt', color: '#10B981' },
  rejected: { label: 'Từ chối', color: '#EF4444' },
  returned: { label: 'Đã trả', color: '#6B7280' },
};

export default function DeviceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { device, borrowHistory, loading, refresh, error } = useDeviceDetail(id as string);

  const statusInfo = device ? (STATUS_CONFIG[device.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.available) : null;
  const imageUrl = device?.image_url ? getImageUrl(device.image_url) : null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const renderReviewItem = ({ item }: { item: any }) => {
    const userName = item.user_name || item.userName || item.user?.name || 'Người dùng';
    const userAvatar = item.user_avatar || item.userAvatar || item.user?.avatar;

    return (
      <View style={styles.reviewCard}>
        {/* User Info Header */}
        <View style={styles.reviewHeader}>
          <View style={styles.userInfo}>
            {userAvatar ? (
              <Image
                source={{ uri: getImageUrl(userAvatar) }}
                style={styles.userAvatar}
              />
            ) : (
              <View style={styles.userAvatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={20} color="#9CA3AF" />
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.reviewDate}>{formatDate(item.createdAt || item.created_at)}</Text>
            </View>
          </View>

          {/* Rating Stars */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons
                key={star}
                name={star <= (item.rating || 0) ? 'star' : 'star-outline'}
                size={16}
                color="#F59E0B"
              />
            ))}
          </View>
        </View>

        {/* Review Comment */}
        {item.comment && (
          <Text style={styles.reviewComment}>{item.comment}</Text>
        )}
      </View>
    );
  };

  if (loading && !device) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!loading && !device) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>
          {error || 'Không tìm thấy thiết bị'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#334155', '#475569']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/user/explore' as any);
              }
            }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết thiết bị</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} colors={['#3B82F6']} />
        }
      >
        {/* Device Image */}
        <View style={styles.imageSection}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.deviceImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="devices" size={80} color="#D1D5DB" />
            </View>
          )}
          {statusInfo && (
            <View style={[styles.floatingStatusBadge, { backgroundColor: statusInfo.bgColor }]}>
              <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
              <Text style={[styles.floatingStatusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>

        {/* Device Info */}
        <View style={styles.infoSection}>
          <Text style={styles.deviceName}>{(device as any).name}</Text>

          {/* Info Cards: Quantity & Rating */}
          <View style={styles.infoCardsRow}>
            {/* Quantity Card */}
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="package-variant" size={24} color="#3B82F6" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Số lượng</Text>
                <Text style={styles.infoCardValue}>{(device as any).quantity || 0}</Text>
              </View>
            </View>

            {/* Rating Card */}
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="star" size={24} color="#F59E0B" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Đánh giá</Text>
                <Text style={styles.infoCardValue}>
                  {(device as any).avg_rating ? (device as any).avg_rating.toFixed(1) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {((device as any).category || (device as any).type) && (
            <View style={styles.categoryBadge}>
              <MaterialCommunityIcons name="tag-outline" size={16} color="#3B82F6" />
              <Text style={styles.categoryText}>{(device as any).category || (device as any).type}</Text>
            </View>
          )}

          {device.description && (
            <View style={styles.descriptionCard}>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <Text style={styles.descriptionText}>{device.description}</Text>
            </View>
          )}

          {/* Specifications */}
          {device.specifications && Object.keys(device.specifications).length > 0 && (
            <View style={styles.specCard}>
              <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
              {Object.entries(device.specifications).map(([key, value]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}:</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reviews */}
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <MaterialCommunityIcons name="star" size={20} color="#1F2937" />
              <Text style={styles.sectionTitle}>Đánh giá</Text>
            </View>

            {borrowHistory.length > 0 ? (
              <FlatList
                data={borrowHistory}
                renderItem={renderReviewItem}
                keyExtractor={(item, index) => item._id || item.id || index.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              />
            ) : (
              <View style={styles.emptyHistory}>
                <MaterialCommunityIcons name="star-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyHistoryText}>Chưa có đánh giá nào</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Borrow Button */}
      {((device as any).status === 'NORMAL' || (device as any).status === 'available') && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.borrowButton}
            onPress={() => router.push(`/user/borrow/${(device as any)._id}` as any)}
          >
            <MaterialCommunityIcons name="hand-extended-outline" size={20} color="#FFFFFF" />
            <Text style={styles.borrowButtonText}>Mượn thiết bị</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}