import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import DeviceCard from '../../../components/DeviceCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const APP_COLORS = {
  background: '#FFFFFF',
  textMain: '#111111',
  textSecondary: '#666666',
  bellBg: '#FFEBF0',
  deadlineBlue: '#E3F2FD', 
  deadlinePink: '#FCE4EC', 
};

// Dữ liệu không cần cứng màu nền nữa
const MOCK_DEADLINES = [
    { id: 1, deviceName: 'Camon EOS R5', daysLeft: 'Còn lại 2 ngày' },
    { id: 2, deviceName: 'Sony Lens 50mm', daysLeft: 'Còn lại 3 ngày' },
    // Thử thêm cái thứ 3 để test màu xen kẽ
    // { id: 3, deviceName: 'Mic Rode', daysLeft: 'Còn lại 5 ngày' }, 
];

const MOCK_DEVICES = [
    { id: 'D001', name: 'Camon EOS R5', description: 'Thiết bị điện thông minh...', quantity: 7, imageUrl: 'https://via.placeholder.com/150x150?text=Camera' },
    { id: 'D002', name: 'Microphone Rode', description: 'Microphone phòng thu...', quantity: 3, imageUrl: 'https://via.placeholder.com/150x150?text=Mic' },
    { id: 'D003', name: 'Gimbal DJI', description: 'Chống rung...', quantity: 5, imageUrl: 'https://via.placeholder.com/150x150?text=Gimbal' },
];

const MOCK_CATEGORIES = [
    { title: 'Camera Recorder', data: MOCK_DEVICES },
    { title: 'Microphone', data: MOCK_DEVICES }, // Dùng chung data test
    { title: 'Camera', data: MOCK_DEVICES },
];

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

            {/* SẮP ĐẾN HẠN TRẢ - Tự động đổi màu */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sắp đến hạn trả</Text>
                <View style={styles.deadlineContainer}>
                    {MOCK_DEADLINES.map((item, index) => {
                        // Logic màu: Chẵn là Xanh, Lẻ là Hồng
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

            {/* THIẾT BỊ ĐỀ XUẤT - Cố định 2 cột, không kéo ngang */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thiết bị đề xuất cho bạn</Text>
                
                {MOCK_CATEGORIES.map((category, index) => (
                    <View key={index} style={styles.categoryBlock}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        
                        {/* Thay FlatList bằng View Row để cố định layout */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, 
        backgroundColor: APP_COLORS.background,
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    welcomeSection: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: '#EEE', marginRight: 12, overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },
    greetingText: { fontSize: 14, color: APP_COLORS.textSecondary, marginBottom: 2 },
    userName: { fontSize: 18, fontWeight: '800', color: APP_COLORS.textMain },
    notificationButton: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: APP_COLORS.bellBg, justifyContent: 'center', alignItems: 'center',
    },

    // Section Styles
    section: { paddingHorizontal: 20, marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: APP_COLORS.textMain, marginBottom: 15 },

    // Deadline Styles
    deadlineContainer: { paddingLeft: 5 },
    deadlineItem: { flexDirection: 'row', marginBottom: 12 },
    timelineWrapper: { width: 24, alignItems: 'center', marginRight: 12 },
    timelineDot: {
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: '#C4C4C4', borderWidth: 2, borderColor: '#FFF',
    },
    timelineLine: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginVertical: 4 },
    deadlineContent: {
        flex: 1, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
    },
    deadlineDays: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4 },
    deadlineDevice: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    
    seeMoreButton: { alignSelf: 'center', marginTop: 5 },
    seeMoreText: { fontSize: 14, fontWeight: '700', textDecorationLine: 'underline', color: '#000' },

    // Category & Device Grid Styles
    categoryBlock: { marginBottom: 20 },
    categoryTitle: { fontSize: 16, fontWeight: '700', color: APP_COLORS.textMain, marginBottom: 10 },
    
    // Style mới cho hàng thiết bị (2 cột)
    deviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Đẩy 2 thẻ ra 2 đầu
        alignItems: 'flex-start',
    }
});