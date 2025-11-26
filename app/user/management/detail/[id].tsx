import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mã màu xanh giống trong ảnh của bạn
const CYAN_COLOR = '#00D2FF'; 

// --- MOCK DATA ---
// Bạn có thể đổi 'status' để test các trường hợp: 
// 'pending' (Chờ duyệt), 'borrowing' (Đang mượn), 'overdue' (Quá hạn), 'cancelled' (Đã hủy), 'returned' (Đã trả)
const MOCK_ORDER_DETAIL = {
    id: 'O1',
    deviceName: 'Camon EOS R5',
    quantity: 1,
    phone: '30939223',
    borrowDate: '12/10/2024',
    returnDate: '23/10/2024',
    reason: 'Thiết bị điện thông minh là giải pháp tự động hóa cho phép kết nối các thiết bị sử dụng điện trong nhà với nhau tạo thành 1 mạng lưới dễ kiểm soát...',
    image: 'https://via.placeholder.com/400x300?text=Camera+Detail',
    
    status: 'pending' // <--- ĐỔI TRẠNG THÁI Ở ĐÂY ĐỂ TEST
};

// Hàm chuyển đổi trạng thái tiếng Anh sang tiếng Việt để hiển thị
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

// Hàm lấy màu sắc cho trạng thái
const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return '#FFA500'; // Cam
        case 'borrowing': return '#007AFF'; // Xanh dương
        case 'overdue': return '#FF3B30'; // Đỏ
        case 'cancelled': return '#8E8E93'; // Xám
        case 'returned': return '#34C759'; // Xanh lá
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

    // 1. Mở modal hủy
    const handleOpenCancelModal = () => {
        setModalVisible(true);
    };

    // 2. Xác nhận hủy
    const confirmCancel = () => {
        if (!cancelReason.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập lý do hủy");
            return;
        }
        setModalVisible(false);
        setStatus('cancelled'); 
        Alert.alert("Thành công", "Yêu cầu mượn thiết bị đã được hủy.");
    };

    // 3. Trả thiết bị
    const handleReturn = () => {
        Alert.alert("Xác nhận", "Bạn muốn trả thiết bị này trước hạn?", [
            { text: "Đóng", style: "cancel" },
            { text: "Đồng ý", onPress: () => {
                setStatus('returned');
                Alert.alert("Thành công", "Đã cập nhật trạng thái trả thiết bị.");
            }}
        ]);
    };

    // --- RENDER NÚT BẤM THEO TRẠNG THÁI ---
    const renderBottomButton = () => {
        switch (status) {
            case 'pending': // Chờ duyệt -> Nút Hủy
                return (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#FF3B30' }]} // Màu đỏ cho hành động hủy
                        onPress={handleOpenCancelModal}
                    >
                        <Text style={styles.actionButtonText}>Hủy yêu cầu</Text>
                    </TouchableOpacity>
                );
            
            case 'borrowing': // Đang mượn -> Nút Trả (Màu XANH giống ảnh)
            case 'overdue':   // Quá hạn -> Nút Trả (Màu XANH giống ảnh)
                return (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: CYAN_COLOR }]} // Màu Cyan
                        onPress={handleReturn}
                    >
                        <Text style={styles.actionButtonText}>Trả thiết bị</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 5}}/>
                    </TouchableOpacity>
                );

            case 'cancelled':
            case 'returned':
            default:
                return null; // Không hiện nút
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
                    {/* Hiển thị trạng thái tiếng Việt */}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    
    imageContainer: {
        width: '100%', height: 300, backgroundColor: '#F5F5F5',
        position: 'relative', justifyContent: 'center', alignItems: 'center',
    },
    mainImage: { width: '70%', height: '70%', resizeMode: 'contain' },
    backButton: {
        position: 'absolute', top: 50, left: 20, zIndex: 10,
        width: 40, height: 40, justifyContent: 'center', borderRadius: 20,
    },
    dotsContainer: { position: 'absolute', bottom: 15, flexDirection: 'row' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD', marginHorizontal: 4 },
    activeDot: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#ccc' },

    contentContainer: { padding: 20 },
    statusContainer: { marginBottom: 10 },
    statusText: { fontSize: 14, fontWeight: 'bold', fontStyle: 'italic' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20 },
    infoItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start', flexWrap: 'wrap' },
    labelText: { fontSize: 15, color: '#000', fontWeight: '400', lineHeight: 22 },
    valueText: { fontSize: 15, color: '#000', fontWeight: '400', lineHeight: 22, flex: 1 },
    reasonBlock: { marginTop: 5 },
    reasonText: { fontSize: 15, color: '#000', lineHeight: 22, textAlign: 'justify', marginTop: 2 },

    // --- Button Styles ---
    bottomContainer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', padding: 20,
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
    },
    // Style chung cho nút bấm (Cyan / Red)
    actionButton: {
        height: 50,
        borderRadius: 30, // Bo tròn nhiều như ảnh
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        // Shadow đẹp
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    actionButtonText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#FFF' // Chữ trắng
    },

    // --- Modal Styles ---
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },
    modalContent: {
        width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
    modalInput: {
        borderWidth: 1, borderColor: '#DDD', borderRadius: 10,
        padding: 10, height: 80, marginBottom: 20, fontSize: 14,
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    modalBtnCancel: {
        flex: 1, padding: 12, borderRadius: 10,
        backgroundColor: '#F5F5F5', marginRight: 10, alignItems: 'center',
    },
    modalBtnConfirm: {
        flex: 1, padding: 12, borderRadius: 10,
        backgroundColor: '#FF3B30', alignItems: 'center',
    },
    modalBtnTextCancel: { fontWeight: '600', color: '#333' },
    modalBtnTextConfirm: { fontWeight: '600', color: '#FFF' },
});