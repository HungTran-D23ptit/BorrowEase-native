import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// 👇 Import styles từ file bên cạnh
import { styles } from './style';

// --- MOCK DATA ---
const MOCK_DETAIL = {
  id: 'D001',
  name: 'Camon EOS R5',
  rating: 4.5,
  reviewCount: 2,
  quantityLeft: 7,
  description: 'Thiết bị điện thông minh là giải pháp tự động hóa cho phép kết nối các thiết bị sử dụng điện trong nhà với nhau tạo thành 1 mạng lưới để kiểm soát...',
  images: [
    'https://via.placeholder.com/400x300?text=Camera+Slide+1', 
    'https://via.placeholder.com/400x300?text=Camera+Slide+2',
  ],
  reviews: [
    { id: 1, user: 'Hoahoang', avatar: 'https://via.placeholder.com/50x50', rating: 5, comment: 'Sản phẩm rất tốt...' },
    { id: 2, user: 'Hoahoang', avatar: 'https://via.placeholder.com/50x50', rating: 5, comment: 'Dùng mượt mà...' },
    { id: 3, user: 'Hoahoang', avatar: 'https://via.placeholder.com/50x50', rating: 4, comment: 'Hơi khó sử dụng...' },
  ]
};

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter(); 

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
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 1. KHỐI ẢNH */}
        <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Image source={{ uri: MOCK_DETAIL.images[0] }} style={styles.mainImage} />
            <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>
        </View>

        {/* 2. THÔNG TIN */}
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

            {/* 3. ĐÁNH GIÁ */}
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

      {/* 4. BUTTON MƯỢN THIẾT BỊ */}
      <View style={styles.bottomContainer}>
         <TouchableOpacity 
            style={styles.borrowButton} 
            // 👇 QUAN TRỌNG: Code chuyển trang đã được sửa đúng
            onPress={() => {
                router.push(`/user/borrow/${MOCK_DETAIL.id}` as any);
            }}
         >
             <Text style={styles.borrowText}>Mượn thiết bị</Text>
             <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
         </TouchableOpacity>
      </View>
    </View>
  );
}