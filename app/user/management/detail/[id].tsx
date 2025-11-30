import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Import styles từ file bên cạnh
import { styles } from './style';

const CYAN_COLOR = '#00D2FF'; 

// --- MOCK DATA ---
const MOCK_ORDER_DETAIL = {
    id: 'O1',
    deviceName: 'Camon EOS R5',
    quantity: 1,
    phone: '30939223',
    borrowDate: '12/10/2024',
    returnDate: '23/10/2024',
    reason: 'Thiết bị điện thông minh là giải pháp tự động hóa cho phép kết nối các thiết bị sử dụng điện trong nhà với nhau tạo thành 1 mạng lưới dễ kiểm soát...',
    image: 'https://via.placeholder.com/400x300?text=Camera+Detail',
    status: 'pending' 
};

const getStatusVietnamese = (status: string) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'borrowing': return 'Đang mượn';
        case 'overdue': return 'Quá hạn';
        case 'cancelled': return 'Đã hủy';
        case 'returned': return 'Đã trả';
        default: return status;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return '#FFA500'; 
        case 'borrowing': return '#007AFF'; 
        case 'overdue': return '#FF3B30'; 
        case 'cancelled': return '#8E8E93'; 
        case 'returned': return '#34C759'; 
        default: return '#000';
    }
};

export default function ManagementDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [status, setStatus] = useState(MOCK_ORDER_DETAIL.status);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // --- CÁC HÀM XỬ LÝ ---
    const handleOpenCancelModal = () => {
        setModalVisible(true);
    };

    const confirmCancel = () => {
        if (!cancelReason.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập lý do hủy");
            return;
        }
        setModalVisible(false);
        setStatus('cancelled'); 
        Alert.alert("Thành công", "Yêu cầu mượn thiết bị đã được hủy.");
    };

    const handleReturn = () => {
        Alert.alert("Xác nhận", "Bạn muốn trả thiết bị này trước hạn?", [
            { text: "Đóng", style: "cancel" },
            { text: "Đồng ý", onPress: () => {
                setStatus('returned');
                Alert.alert("Thành công", "Đã cập nhật trạng thái trả thiết bị.");
            }}
        ]);
    };

    const renderBottomButton = () => {
        switch (status) {
            case 'pending': 
                return (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#FF3B30' }]} 
                        onPress={handleOpenCancelModal}
                    >
                        <Text style={styles.actionButtonText}>Hủy yêu cầu</Text>
                    </TouchableOpacity>
                );
            
            case 'borrowing': 
            case 'overdue':   
                return (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: CYAN_COLOR }]} 
                        onPress={handleReturn}
                    >
                        <Text style={styles.actionButtonText}>Trả thiết bị</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 5}}/>
                    </TouchableOpacity>
                );

            case 'cancelled':
            case 'returned':
            default:
                return null; 
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* 1. ẢNH HEADER */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Image source={{ uri: MOCK_ORDER_DETAIL.image }} style={styles.mainImage} />
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                {/* 2. THÔNG TIN CHI TIẾT */}
                <View style={styles.contentContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                            • {getStatusVietnamese(status).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.title}>Thông tin mượn sản phẩm</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>1. Tên thiết bị: </Text>
                        <Text style={styles.valueText}>{MOCK_ORDER_DETAIL.deviceName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>2. Số lượng: </Text>
                        <Text style={styles.valueText}>{MOCK_ORDER_DETAIL.quantity}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>3. Số điện thoại liên hệ: </Text>
                        <Text style={styles.valueText}>{MOCK_ORDER_DETAIL.phone}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>4. Thời gian mượn: </Text>
                        <Text style={styles.valueText}>{MOCK_ORDER_DETAIL.borrowDate}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>5. Thời gian trả: </Text>
                        <Text style={styles.valueText}>{MOCK_ORDER_DETAIL.returnDate}</Text>
                    </View>
                    <View style={styles.reasonBlock}>
                        <Text style={styles.labelText}>6. Lý do mượn: </Text>
                        <Text style={styles.reasonText}>{MOCK_ORDER_DETAIL.reason}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* 3. VÙNG NÚT BẤM */}
            {status !== 'cancelled' && status !== 'returned' && (
                <View style={styles.bottomContainer}>
                    {renderBottomButton()}
                </View>
            )}

            {/* 4. MODAL HỦY */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Lý do hủy thiết bị</Text>
                        <Text style={styles.modalSubtitle}>Vui lòng cho biết lý do bạn muốn hủy yêu cầu này.</Text>
                        
                        <TextInput 
                            style={styles.modalInput}
                            placeholder="Nhập lý do..."
                            multiline
                            numberOfLines={3}
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            textAlignVertical="top"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalBtnTextCancel}>Đóng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBtnConfirm} onPress={confirmCancel}>
                                <Text style={styles.modalBtnTextConfirm}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}