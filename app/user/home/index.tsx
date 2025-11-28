import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 1. Import Component bên ngoài
import DeviceCard from '../../../components/DeviceCard';

// 2. Import Styles và Colors từ file styles.ts
import { styles, APP_COLORS } from './styles';

// 3. Import Data từ file data.ts
import { MOCK_DEADLINES, MOCK_CATEGORIES } from './data';

export default function HomeScreen() {
    
    const handleNotificationPress = () => {
        Alert.alert("Thông báo", "Bạn đã bấm vào nút chuông!");
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.welcomeSection}>
                    <View style={styles.avatarContainer}>
                       <Image source={{ uri: 'https://via.placeholder.com/100x100?text=H' }} style={styles.avatarImage} />
                    </View>
                    <View>
                        <Text style={styles.greetingText}>Chúc bạn ngày mới vui vẻ</Text>
                        <Text style={styles.userName}>Hoahoang</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* SẮP ĐẾN HẠN TRẢ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sắp đến hạn trả</Text>
                <View style={styles.deadlineContainer}>
                    {MOCK_DEADLINES.map((item, index) => {
                        // Logic màu: Chẵn là Xanh, Lẻ là Hồng
                        // Chúng ta lấy APP_COLORS từ file styles đã import
                        const backgroundColor = index % 2 === 0 ? APP_COLORS.deadlineBlue : APP_COLORS.deadlinePink;
                        
                        return (
                            <View key={item.id} style={styles.deadlineItem}>
                                <View style={styles.timelineWrapper}>
                                    <View style={styles.timelineDot} />
                                    {index < MOCK_DEADLINES.length - 1 && <View style={styles.timelineLine} />}
                                </View>
                                <View style={[styles.deadlineContent, { backgroundColor }]}>
                                    <Text style={styles.deadlineDays}>{item.daysLeft}</Text>
                                    <Text style={styles.deadlineDevice}>{item.deviceName}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <TouchableOpacity style={styles.seeMoreButton}>
                    <Text style={styles.seeMoreText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>

            {/* THIẾT BỊ ĐỀ XUẤT */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thiết bị đề xuất cho bạn</Text>
                
                {MOCK_CATEGORIES.map((category, index) => (
                    <View key={index} style={styles.categoryBlock}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        
                        <View style={styles.deviceRow}>
                            {/* Chỉ lấy 2 thiết bị đầu tiên để hiển thị */}
                            {category.data.slice(0, 2).map((device) => (
                                <DeviceCard key={device.id} device={device} />
                            ))}
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={{height: 80}} /> 
        </ScrollView>
    );
}