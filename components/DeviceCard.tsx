import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router'; // 1. Import useRouter để điều hướng

const { width } = Dimensions.get('window');

// Tính toán: (Màn hình - 40px padding - 15px khoảng cách giữa) chia 2
const CARD_WIDTH = (width - 40 - 15) / 2; 

const DeviceCard = ({ device }: { device: any }) => {
  const router = useRouter(); // 2. Khởi tạo router

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      // 3. Thêm sự kiện onPress để chuyển trang
      onPress={() => router.push({
        pathname: "/user/device/[id]", // Đường dẫn đến file [id].tsx
        params: { id: device.id }      // Truyền ID thiết bị đi
      })}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: device.imageUrl }} style={styles.image} />
        <View style={styles.quantityTag}>
          <Text style={styles.quantityText}>SL: {device.quantity}</Text>
        </View>
      </View>
      
      <Text style={styles.deviceName} numberOfLines={1}>
        {device.name}
      </Text>
      <Text style={styles.deviceDescription} numberOfLines={2}>
        {device.description}
      </Text>
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
  quantityTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#1ABC9C',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  quantityText: {
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
  },
});

export default DeviceCard;