import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './detail-styles';

// Mock data cho chi tiết thiết bị
const MOCK_DEVICE_DETAIL = {
    id: 'D001',
    name: 'Canon EOS R5',
    category: 'Camera',
    status: 'available',
    quantity: 5,
    totalQuantity: 8,
    location: 'Phòng A101',
    description: 'Máy ảnh mirrorless full-frame cao cấp với cảm biến 45MP, quay video 8K RAW, chống rung IBIS 8 stops. Phù hợp cho nhiếp ảnh chuyên nghiệp và quay phim.',
    images: [
        'https://via.placeholder.com/400x300?text=Canon+EOS+R5',
        'https://via.placeholder.com/400x300?text=Camera+Side',
    ],
    specifications: [
        { label: 'Cảm biến', value: '45MP Full-frame CMOS' },
        { label: 'Video', value: '8K RAW 30fps' },
        { label: 'Chống rung', value: 'IBIS 8 stops' },
        { label: 'ISO', value: '100-51200' },
    ],
    borrowHistory: [
        { id: 1, user: 'Nguyễn Văn A', date: '15/11/2024', returnDate: '20/11/2024', status: 'returned' },
        { id: 2, user: 'Trần Thị B', date: '10/11/2024', returnDate: '12/11/2024', status: 'returned' },
        { id: 3, user: 'Lê Văn C', date: '01/12/2024', returnDate: '05/12/2024', status: 'borrowing' },
    ],
};

const STATUS_CONFIG = {
    available: { label: 'Sẵn có', color: '#4CAF50', bgColor: '#E8F5E9' },
    borrowed: { label: 'Đang mượn', color: '#2196F3', bgColor: '#E3F2FD' },
    maintenance: { label: 'Bảo trì', color: '#FF9800', bgColor: '#FFF3E0' },
};

export default function AdminDeviceDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const statusInfo = STATUS_CONFIG[MOCK_DEVICE_DETAIL.status as keyof typeof STATUS_CONFIG];

    const handleEdit = () => {
        Alert.alert('Chỉnh sửa thiết bị', 'Tính năng đang được phát triển');
    };

    const handleDelete = () => {
        Alert.alert(
            'Xóa thiết bị',
            'Bạn có chắc chắn muốn xóa thiết bị này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => router.back() },
            ]
        );
    };

    const handleChangeStatus = () => {
        Alert.alert('Thay đổi trạng thái', 'Tính năng đang được phát triển');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* KHỐI ẢNH */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Image source={{ uri: MOCK_DEVICE_DETAIL.images[currentImageIndex] }} style={styles.mainImage} />
                    <View style={styles.dotsContainer}>
                        {MOCK_DEVICE_DETAIL.images.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.dot, index === currentImageIndex && styles.activeDot]}
                            />
                        ))}
                    </View>
                </View>

                {/* THÔNG TIN CHÍNH */}
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.deviceName}>{MOCK_DEVICE_DETAIL.name}</Text>
                            <Text style={styles.categoryText}>{MOCK_DEVICE_DETAIL.category}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                            <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                {statusInfo.label}
                            </Text>
                        </View>
                    </View>

                    {/* THÔNG TIN NHANH */}
                    <View style={styles.quickInfoContainer}>
                        <View style={styles.quickInfoItem}>
                            <MaterialCommunityIcons name="package-variant" size={20} color="#666" />
                            <Text style={styles.quickInfoLabel}>Số lượng</Text>
                            <Text style={styles.quickInfoValue}>
                                {MOCK_DEVICE_DETAIL.quantity}/{MOCK_DEVICE_DETAIL.totalQuantity}
                            </Text>
                        </View>
                        <View style={styles.quickInfoDivider} />
                        <View style={styles.quickInfoItem}>
                            <Ionicons name="location-outline" size={20} color="#666" />
                            <Text style={styles.quickInfoLabel}>Vị trí</Text>
                            <Text style={styles.quickInfoValue}>{MOCK_DEVICE_DETAIL.location}</Text>
                        </View>
                    </View>

                    {/* MÔ TẢ */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mô tả</Text>
                        <Text style={styles.descriptionText}>{MOCK_DEVICE_DETAIL.description}</Text>
                    </View>

                    {/* THÔNG SỐ KỸ THUẬT */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
                        {MOCK_DEVICE_DETAIL.specifications.map((spec, index) => (
                            <View key={index} style={styles.specRow}>
                                <Text style={styles.specLabel}>{spec.label}</Text>
                                <Text style={styles.specValue}>{spec.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* LỊCH SỬ MƯỢN */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Lịch sử mượn</Text>
                        {MOCK_DEVICE_DETAIL.borrowHistory.map((history) => (
                            <View key={history.id} style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <Text style={styles.historyUser}>{history.user}</Text>
                                    <View style={[
                                        styles.historyStatusBadge,
                                        { backgroundColor: history.status === 'returned' ? '#E8F5E9' : '#E3F2FD' }
                                    ]}>
                                        <Text style={[
                                            styles.historyStatusText,
                                            { color: history.status === 'returned' ? '#4CAF50' : '#2196F3' }
                                        ]}>
                                            {history.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.historyDates}>
                                    <Text style={styles.historyDate}>Mượn: {history.date}</Text>
                                    <Text style={styles.historyDate}>Trả: {history.returnDate}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* BOTTOM ACTIONS */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
                    <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statusButton} onPress={handleChangeStatus}>
                    <MaterialCommunityIcons name="swap-horizontal" size={20} color="#FF6B35" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <MaterialCommunityIcons name="delete" size={20} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
