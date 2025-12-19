import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getBorrowRequestDetail, cancelBorrowRequest, requestReturnDevice } from '../../../../services/user/borrowRequest.service';
import { getImageUrl } from '../../../../services/rootApi';
import { useToast } from '../../../../contexts/ToastContext';
import { styles } from './style';

const CYAN_COLOR = '#00D2FF';

const getStatusVietnamese = (status: string) => {
    switch (status) {
        case 'PENDING': return 'Chờ duyệt';
        case 'APPROVED': return 'Đã duyệt';
        case 'BORROWING': return 'Đang mượn';
        case 'RETURNING': return 'Đang trả';
        case 'RETURNED': return 'Đã trả';
        case 'OVERDUE': return 'Quá hạn';
        case 'CANCELLED': return 'Đã hủy';
        case 'REJECTED': return 'Bị từ chối';
        default: return status;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return '#FFA500';
        case 'APPROVED': return '#34C759';
        case 'BORROWING': return '#007AFF';
        case 'RETURNING': return '#5856D6';
        case 'RETURNED': return '#34C759';
        case 'OVERDUE': return '#FF3B30';
        case 'CANCELLED': return '#8E8E93';
        case 'REJECTED': return '#FF3B30';
        default: return '#000';
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

export default function ManagementDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { showSuccess, showError } = useToast();

    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchRequestDetail();
    }, [id]);

    const fetchRequestDetail = async () => {
        try {
            setLoading(true);
            const data = await getBorrowRequestDetail(id as string);
            setRequest(data);
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể tải chi tiết yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCancelModal = () => {
        setModalVisible(true);
    };

    const confirmCancel = async () => {
        if (!cancelReason.trim()) {
            showError("Vui lòng nhập lý do hủy");
            return;
        }

        try {
            setActionLoading(true);
            await cancelBorrowRequest(id as string);
            showSuccess("Yêu cầu mượn thiết bị đã được hủy");
            setModalVisible(false);
            fetchRequestDetail(); 
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể hủy yêu cầu');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReturn = async () => {
        try {
            setActionLoading(true);
            await requestReturnDevice(id as string);
            showSuccess("Đã gửi yêu cầu trả thiết bị");
            fetchRequestDetail(); 
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể gửi yêu cầu trả');
        } finally {
            setActionLoading(false);
        }
    };

    const renderBottomButton = () => {
        if (!request) return null;

        switch (request.status) {
            case 'PENDING':
                return (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                        onPress={handleOpenCancelModal}
                        disabled={actionLoading}
                    >
                        <Text style={styles.actionButtonText}>Hủy yêu cầu</Text>
                    </TouchableOpacity>
                );

            case 'APPROVED':
            case 'BORROWING':
            case 'OVERDUE':
                return (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: CYAN_COLOR }]}
                        onPress={handleReturn}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.actionButtonText}>Trả thiết bị</Text>
                                <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 5 }} />
                            </>
                        )}
                    </TouchableOpacity>
                );

            case 'CANCELLED':
            case 'RETURNED':
            case 'REJECTED':
            case 'RETURNING':
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10, color: '#666' }}>Đang tải...</Text>
            </View>
        );
    }

    if (!request) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={64} color="#999" />
                <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Không tìm thấy yêu cầu</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#007AFF', borderRadius: 8 }}
                    onPress={() => router.back()}
                >
                    <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const deviceImage = request.device?.image_url ? getImageUrl(request.device.image_url) : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* 1. ẢNH HEADER */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Image source={{ uri: deviceImage }} style={styles.mainImage} />
                </View>

                {/* 2. THÔNG TIN CHI TIẾT */}
                <View style={styles.contentContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                            • {getStatusVietnamese(request.status).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.title}>Thông tin mượn sản phẩm</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>1. Tên thiết bị: </Text>
                        <Text style={styles.valueText}>{request.device?.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>2. Số lượng: </Text>
                        <Text style={styles.valueText}>{request.quantity || 0}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>3. Người mượn: </Text>
                        <Text style={styles.valueText}>{request.user?.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>4. Thời gian mượn: </Text>
                        <Text style={styles.valueText}>{formatDate(request.borrow_date)}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.labelText}>5. Thời gian trả dự kiến: </Text>
                        <Text style={styles.valueText}>{formatDate(request.return_date)}</Text>
                    </View>
                    {request.actual_return_date && (
                        <View style={styles.infoItem}>
                            <Text style={styles.labelText}>6. Thời gian trả thực tế: </Text>
                            <Text style={styles.valueText}>{formatDate(request.actual_return_date)}</Text>
                        </View>
                    )}
                    <View style={styles.reasonBlock}>
                        <Text style={styles.labelText}>
                            {request.actual_return_date ? '7' : '6'}. Lý do mượn:
                        </Text>
                        <Text style={styles.reasonText}>{request.reason || 'Không có lý do'}</Text>
                    </View>
                    {request.note && (
                        <View style={styles.reasonBlock}>
                            <Text style={styles.labelText}>Ghi chú: </Text>
                            <Text style={styles.reasonText}>{request.note}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* 3. VÙNG NÚT BẤM */}
            {renderBottomButton() && (
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
                            <TouchableOpacity
                                style={styles.modalBtnCancel}
                                onPress={() => setModalVisible(false)}
                                disabled={actionLoading}
                            >
                                <Text style={styles.modalBtnTextCancel}>Đóng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalBtnConfirm}
                                onPress={confirmCancel}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.modalBtnTextConfirm}>Xác nhận</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}