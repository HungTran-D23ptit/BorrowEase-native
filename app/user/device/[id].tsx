import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- MOCK DATA CHO MÀN HÌNH CHI TIẾT ---
const MOCK_DETAIL = {
  id: 'D001',
  name: 'Camon EOS R5',
  rating: 4.5,
  reviewCount: 2,
  quantityLeft: 7,
  description: 'Thiết bị điện thông minh là giải pháp tự động hóa cho phép kết nối các thiết bị sử dụng điện trong nhà với nhau tạo thành 1 mạng lưới để kiểm soát. Với sự kết hợp này sẽ dễ dàng điều khiển các thiết bị, có khả năng tự động xử lý và thông báo đến người dùng. Ngoài ra, sự kết hợp này có khả năng tương tác được với các thông số môi trường...',
  images: [
    'https://via.placeholder.com/400x300?text=Camera+Slide+1', // Ảnh demo
    'https://via.placeholder.com/400x300?text=Camera+Slide+2',
  ],
  reviews: [
    { id: 1, user: 'Hoahoang', avatar: 'https://via.placeholder.com/50x50', rating: 5, comment: 'Thiết bị điện thông minh là giải pháp tự động hóa cho phép kết nối các thiết bị...' },
    { id: 2, user: 'Hoahoang', avatar: 'https://via.placeholder.com/50x50', rating: 5, comment: 'Sản phẩm rất tốt, dùng mượt mà...' },
    { id: 3, user: 'Hoahoang', avatar: 'https://via.placeholder.com/50x50', rating: 4, comment: 'Hơi khó sử dụng lúc đầu nhưng sau thì ổn.' },
  ]
};

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams(); // Lấy ID từ URL (nếu cần gọi API sau này)
  const router = useRouter();

  // Hàm render số sao đánh giá
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons 
        key={index} 
        name={index < Math.floor(rating) ? "star" : "star-outline"} 
        size={16} 
        color="#FFD700" 
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Cấu hình Header ẩn đi để ta tự làm Custom Header trên ảnh */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 1. KHỐI ẢNH SLIDER */}
        <View style={styles.imageContainer}>
            {/* Nút Back */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            
            <Image source={{ uri: MOCK_DETAIL.images[0] }} style={styles.mainImage} />
            
            {/* Dots Indicator (Giả lập) */}
            <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>
        </View>

        {/* 2. THÔNG TIN CHÍNH */}
        <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.deviceName}>{MOCK_DETAIL.name}</Text>
                <Text style={styles.quantityText}>Còn lại: {MOCK_DETAIL.quantityLeft}</Text>
            </View>

            <View style={styles.ratingRow}>
                <Text style={styles.ratingScore}>{MOCK_DETAIL.rating}</Text>
                <View style={{flexDirection: 'row', marginLeft: 5, marginRight: 5}}>
                    {renderStars(MOCK_DETAIL.rating)}
                </View>
                <Text style={styles.reviewCount}>({MOCK_DETAIL.reviewCount})</Text>
            </View>

            <Text style={styles.descriptionText}>
                {MOCK_DETAIL.description}
            </Text>

            {/* 3. DANH SÁCH ĐÁNH GIÁ */}
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            
            {MOCK_DETAIL.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                        <Image source={{ uri: review.avatar }} style={styles.avatar} />
                        <Text style={styles.reviewerName}>{review.user}</Text>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                             <View style={{flexDirection: 'row'}}>{renderStars(review.rating)}</View>
                        </View>
                    </View>
                    <Text style={styles.reviewComment} numberOfLines={3}>
                        {review.comment} Xem thêm ...
                    </Text>
                </View>
            ))}
        </View>
      </ScrollView>

      {/* 4. BUTTON MƯỢN THIẾT BỊ (FIXED BOTTOM) */}
      <View style={styles.bottomContainer}>
         <TouchableOpacity style={styles.borrowButton} onPress={() => console.log('Mượn')}>
             <Text style={styles.borrowText}>Mượn thiết bị</Text>
             <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // --- Image & Header ---
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    // backgroundColor: 'rgba(255,255,255,0.5)', // Nếu cần nền mờ cho nút back
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 20,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD', marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#ccc' // Hoặc màu chủ đạo
  },

  // --- Content ---
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 25,
    textAlign: 'justify',
  },
  
  // --- Reviews ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 15,
    marginBottom: 15,
    // Shadow nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 30, height: 30, borderRadius: 15, marginRight: 10, backgroundColor: '#DDD',
  },
  reviewerName: {
    fontWeight: 'bold', fontSize: 14,
  },
  reviewComment: {
    fontSize: 13, color: '#555', lineHeight: 18,
  },

  // --- Bottom Button ---
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  borrowButton: {
    backgroundColor: '#00D2FF', // Màu xanh Cyan như ảnh (hoặc chỉnh thành #00BFFF)
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30, // Bo tròn nhiều
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  borrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});