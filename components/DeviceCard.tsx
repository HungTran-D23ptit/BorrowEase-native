import { getImageUrl } from '@/services/rootApi';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Tính toán: (Màn hình - 40px padding - 15px khoảng cách giữa) chia 2
const CARD_WIDTH = (width - 40 - 15) / 2;

interface Device {
  _id: string;
  name: string;
  description?: string;
  image_url?: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'unavailable';
  category?: string;
  quantity?: number;
  available_quantity?: number;
}

const STATUS_CONFIG = {
  available: { label: 'Sẵn sàng', color: '#10B981' },
  borrowed: { label: 'Đang mượn', color: '#3B82F6' },
  maintenance: { label: 'Bảo trì', color: '#F59E0B' },
  unavailable: { label: 'Không khả dụng', color: '#EF4444' },
};

const DeviceCard = ({ device }: { device: Device }) => {
  const router = useRouter();
  const imageUrl = device.image_url ? getImageUrl(device.image_url) : null;
  const statusInfo = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.push({
        pathname: "/user/device/[id]" as any,
        params: { id: device._id }
      })}
    >
      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="devices" size={40} color="#D1D5DB" />
          </View>
        )}
        <View style={[styles.statusTag, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>
        {(device.quantity !== undefined || device.available_quantity !== undefined) && (
          <View style={styles.quantityBadge}>
            <MaterialCommunityIcons name="package-variant" size={12} color="#FFFFFF" />
            <Text style={styles.quantityText}>
              {device.available_quantity ?? device.quantity ?? 0}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.deviceName} numberOfLines={1}>
        {device.name}
      </Text>
      <Text style={styles.deviceDescription} numberOfLines={2}>
        {device.description || 'Không có mô tả'}
      </Text>
      {device.category && (
        <Text style={styles.categoryText} numberOfLines={1}>
          {device.category}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    // Không đặt marginRight ở đây nữa, cha (parent) sẽ lo việc căn chỉnh
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  imageWrapper: {
    position: 'relative',
    height: 120, // Giảm chiều cao chút cho cân đối
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  statusTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  deviceDescription: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  quantityBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 3,
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DeviceCard;