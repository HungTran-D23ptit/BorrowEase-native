import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, LayoutAnimation, Modal, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { showError, showSuccess } from '../../../services/ToastService';
import { getImageUrl } from '../../../services/rootApi';
import * as borrowRequestService from '../../../services/user/borrowRequest.service';

// Bật Animation cho Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Interface cho borrow request
interface BorrowRequest {
    _id: string;
    device: {
        _id: string;
        name: string;
        description?: string;
        image?: string;
        image_url?: string;
    };
    quantity: number;
    status: string;
    borrow_date: string;
    return_date: string;
    reason?: string;
    note?: string;
}

export default function ManagementScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [expandedSection, setExpandedSection] = useState<string | null>('pending');

    // Data states
    const [pendingRequests, setPendingRequests] = useState<BorrowRequest[]>([]);
    const [borrowingRequests, setBorrowingRequests] = useState<BorrowRequest[]>([]);
    const [overdueRequests, setOverdueRequests] = useState<BorrowRequest[]>([]);
    const [cancelledRequests, setCancelledRequests] = useState<BorrowRequest[]>([]);
    const [returnedRequests, setReturnedRequests] = useState<BorrowRequest[]>([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Modal states
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);

    // Review states
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Fetch data từ API
    const fetchAllRequests = async () => {
        try {
            const [pending, borrowing, overdue, cancelled, returned] = await Promise.all([
                borrowRequestService.getBorrowRequests({ status: 'PENDING', per_page: 100 }),
                borrowRequestService.getBorrowingDevices({ per_page: 100 }),
                borrowRequestService.getOverdueDevices({ per_page: 100 }),
                borrowRequestService.getBorrowRequests({ status: 'CANCELLED', per_page: 100 }),
                borrowRequestService.getReturnedDevices({ per_page: 100 }),
            ]);

            setPendingRequests(pending.requests || []);
            setBorrowingRequests(borrowing.borrowings || []);
            setOverdueRequests(overdue.overdue || []);
            setCancelledRequests(cancelled.requests || []);
            setReturnedRequests(returned.returned || []);
        } catch (error: any) {
            console.error('Error fetching requests:', error);
            showError(error?.response?.data?.message || 'Không thể tải danh sách đơn mượn');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAllRequests();
    }, []);

    const handleCancelRequest = async (requestId: string) => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn hủy đơn mượn này?',
            [
                { text: 'Không', style: 'cancel' },
                {
                    text: 'Hủy đơn',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(requestId);
                            await borrowRequestService.cancelBorrowRequest(requestId);
                            showSuccess('Đã hủy đơn mượn');
                            await fetchAllRequests();
                        } catch (error: any) {
                            showError(error?.response?.data?.message || 'Không thể hủy đơn mượn');
                        } finally {
                            setActionLoading(null);
                        }
                    },
                },
            ]
        );
    };

    const handleRequestReturn = async (requestId: string) => {
        Alert.alert(
            'Xác nhận',
            'Bạn muốn yêu cầu trả thiết bị này?',
            [
                { text: 'Không', style: 'cancel' },
                {
                    text: 'Yêu cầu trả',
                    onPress: async () => {
                        try {
                            setActionLoading(requestId);
                            await borrowRequestService.requestReturnDevice(requestId);
                            showSuccess('Đã gửi yêu cầu trả thiết bị');
                            await fetchAllRequests();
                        } catch (error: any) {
                            showError(error?.response?.data?.message || 'Không thể gửi yêu cầu trả');
                        } finally {
                            setActionLoading(null);
                        }
                    },
                },
            ]
        );
    };

    const handleSubmitReview = async () => {
        if (!selectedRequest) return;

        if (!comment.trim()) {
            showError('Vui lòng nhập nhận xét');
            return;
        }

        try {
            setActionLoading(selectedRequest._id);
            await borrowRequestService.reviewDevice(selectedRequest._id, {
                rating,
                comment: comment.trim(),
            });

            showSuccess('Đã gửi đánh giá thành công!');
            setReviewModalVisible(false);
            setRating(5);
            setComment('');
            setDetailModalVisible(false);
            await fetchAllRequests();
        } catch (error: any) {
            console.error('Error submitting review:', error);
            showError(error?.response?.data?.message || 'Không thể gửi đánh giá');
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        fetchAllRequests();
    }, []);

    const toggleSection = (section: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSection(expandedSection === section ? null : section);
    };

    const renderRequestCard = (request: BorrowRequest, showActions: boolean = false) => {
        const isLoading = actionLoading === request._id;
        const device = request.device || {};
        const deviceImageUrl = device.image_url ? getImageUrl(device.image_url) : null;

        return (
            <View key={request._id} style={styles.requestCard}>
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() => {
                        setSelectedRequest(request);
                        setSelectedRequestId(request._id);
                        setDetailModalVisible(true);
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.deviceInfo}>
                            {deviceImageUrl ? (
                                <Image source={{ uri: deviceImageUrl }} style={styles.deviceImage} />
                            ) : (
                                <View style={styles.deviceImagePlaceholder}>
                                    <Ionicons name="cube-outline" size={24} color="#9CA3AF" />
                                </View>
                            )}
                            <View style={styles.deviceTextContainer}>
                                <Text style={styles.deviceName} numberOfLines={1}>
                                    {device.name || 'Thiết bị'}
                                </Text>
                                <Text style={styles.deviceCode}>
                                    SL: {request.quantity || 0}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </View>

                    <View style={styles.dateRow}>
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={14} color="#334155" />
                            <Text style={styles.dateText}>{new Date(request.borrow_date).toLocaleDateString('vi-VN')}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={14} color="#9CA3AF" />
                        <View style={styles.dateItem}>
                            <Ionicons name="calendar-outline" size={14} color="#334155" />
                            <Text style={styles.dateText}>{new Date(request.return_date).toLocaleDateString('vi-VN')}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {showActions && (
                    <View style={styles.actionButtons}>
                        {request.status === 'PENDING' && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => handleCancelRequest(request._id)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="close-circle-outline" size={16} color="#fff" />
                                        <Text style={styles.actionButtonText}>Hủy đơn</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                        {(request.status === 'APPROVED' || request.status === 'OVERDUE') && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.returnButton]}
                                onPress={() => handleRequestReturn(request._id)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="return-up-back-outline" size={16} color="#fff" />
                                        <Text style={styles.actionButtonText}>Yêu cầu trả</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const renderSection = (title: string, data: BorrowRequest[], sectionKey: string, showActions: boolean = false) => {
        const isOpen = expandedSection === sectionKey;
        const count = data.length;

        return (
            <View key={sectionKey} style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(sectionKey)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sectionTitle}>{title} ({count})</Text>
                    <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
                </TouchableOpacity>

                {isOpen && (
                    <View style={styles.sectionBody}>
                        {data.length === 0 ? (
                            <Text style={styles.emptyText}>Không có yêu cầu nào</Text>
                        ) : (
                            data.map(request => renderRequestCard(request, showActions))
                        )}
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#334155', '#475569']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <Text style={styles.headerTitle}>Quản lý đơn mượn</Text>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm thiết bị..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B35']} />
                }
            >
                {renderSection("Chờ duyệt", pendingRequests, 'pending', true)}
                {renderSection("Quá hạn", overdueRequests, 'overdue', true)}
                {renderSection("Đang mượn", borrowingRequests, 'borrowing', true)}
                {renderSection("Đã hủy", cancelledRequests, 'cancelled', false)}
                {renderSection("Đã trả", returnedRequests, 'returned', false)}
            </ScrollView>

            {/* Detail Modal */}
            <Modal
                visible={detailModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => {
                    setDetailModalVisible(false);
                    setSelectedRequestId(null);
                    setSelectedRequest(null);
                }}
            >
                <View style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => {
                                setDetailModalVisible(false);
                                setSelectedRequestId(null);
                                setSelectedRequest(null);
                            }}
                            style={styles.modalCloseButton}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalHeaderTitle}>Chi tiết đơn mượn</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {selectedRequest ? (
                        <>
                            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                                {/* Status Badge */}
                                <View style={styles.modalStatusSection}>
                                    <View style={[
                                        styles.modalStatusBadge,
                                        {
                                            backgroundColor:
                                                selectedRequest.status === 'PENDING' ? '#FFF3E0' :
                                                    selectedRequest.status === 'APPROVED' ? '#E3F2FD' :
                                                        selectedRequest.status === 'REJECTED' ? '#FFEBEE' :
                                                            selectedRequest.status === 'CANCELLED' ? '#F5F5F5' :
                                                                selectedRequest.status === 'RETURNING' ? '#EDE7F6' :
                                                                    selectedRequest.status === 'RETURNED' ? '#E8F5E9' :
                                                                        selectedRequest.status === 'OVERDUE' ? '#FFEBEE' : '#F5F5F5'
                                        }
                                    ]}>
                                        <Text style={[
                                            styles.modalStatusText,
                                            {
                                                color:
                                                    selectedRequest.status === 'PENDING' ? '#FF9500' :
                                                        selectedRequest.status === 'APPROVED' ? '#334155' :
                                                            selectedRequest.status === 'REJECTED' ? '#FF3B30' :
                                                                selectedRequest.status === 'CANCELLED' ? '#8E8E93' :
                                                                    selectedRequest.status === 'RETURNING' ? '#5856D6' :
                                                                        selectedRequest.status === 'RETURNED' ? '#34C759' :
                                                                            selectedRequest.status === 'OVERDUE' ? '#FF3B30' : '#8E8E93'
                                            }
                                        ]}>
                                            {
                                                selectedRequest.status === 'PENDING' ? 'Chờ duyệt' :
                                                    selectedRequest.status === 'APPROVED' ? 'Đang mượn' :
                                                        selectedRequest.status === 'REJECTED' ? 'Từ chối' :
                                                            selectedRequest.status === 'CANCELLED' ? 'Đã hủy' :
                                                                selectedRequest.status === 'RETURNING' ? 'Đang trả' :
                                                                    selectedRequest.status === 'RETURNED' ? 'Đã trả' :
                                                                        selectedRequest.status === 'OVERDUE' ? 'Quá hạn' : 'Không xác định'
                                            }
                                        </Text>
                                    </View>
                                </View>

                                {/* Device Information */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Thông tin thiết bị</Text>
                                    <View style={styles.modalDeviceCard}>
                                        {selectedRequest.device?.image_url ? (
                                            <Image
                                                source={{ uri: getImageUrl(selectedRequest.device.image_url) }}
                                                style={styles.modalDeviceImage}
                                            />
                                        ) : (
                                            <View style={styles.modalDeviceImagePlaceholder}>
                                                <MaterialCommunityIcons name="devices" size={48} color="#9CA3AF" />
                                            </View>
                                        )}
                                        <View style={styles.modalDeviceInfo}>
                                            <Text style={styles.modalDeviceName}>{selectedRequest.device?.name || 'N/A'}</Text>
                                            {selectedRequest.device?.description && (
                                                <Text style={styles.modalDeviceDescription} numberOfLines={2}>
                                                    {selectedRequest.device.description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                {/* Borrow Information */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Thông tin mượn trả</Text>
                                    <View style={styles.modalCard}>
                                        <View style={styles.modalDetailRow}>
                                            <MaterialCommunityIcons name="calendar-export" size={20} color="#334155" />
                                            <Text style={styles.modalLabel}>Ngày mượn:</Text>
                                            <Text style={styles.modalValue}>
                                                {new Date(selectedRequest.borrow_date).toLocaleDateString('vi-VN')}
                                            </Text>
                                        </View>
                                        <View style={styles.modalDivider} />
                                        <View style={styles.modalDetailRow}>
                                            <MaterialCommunityIcons name="calendar-import" size={20} color="#334155" />
                                            <Text style={styles.modalLabel}>Ngày trả:</Text>
                                            <Text style={styles.modalValue}>
                                                {new Date(selectedRequest.return_date).toLocaleDateString('vi-VN')}
                                            </Text>
                                        </View>
                                        <View style={styles.modalDivider} />
                                        <View style={styles.modalDetailRow}>
                                            <MaterialCommunityIcons name="package-variant" size={20} color="#334155" />
                                            <Text style={styles.modalLabel}>Số lượng:</Text>
                                            <Text style={[styles.modalValue, { color: '#334155', fontWeight: '600' }]}>
                                                {selectedRequest.quantity || 0}
                                            </Text>
                                        </View>
                                        {selectedRequest.reason && (
                                            <>
                                                <View style={styles.modalDivider} />
                                                <View style={styles.modalDetailRow}>
                                                    <MaterialCommunityIcons name="note-text-outline" size={20} color="#334155" />
                                                    <Text style={styles.modalLabel}>Lý do mượn:</Text>
                                                    <Text style={styles.modalValue} numberOfLines={3}>
                                                        {selectedRequest.reason}
                                                    </Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </View>

                                {/* Rejection Reason */}
                                {selectedRequest.note && selectedRequest.status === 'REJECTED' && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Lý do từ chối</Text>
                                        <View style={[styles.modalCard, styles.modalRejectCard]}>
                                            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                                            <Text style={styles.modalRejectText}>{selectedRequest.note}</Text>
                                        </View>
                                    </View>
                                )}

                                <View style={{ height: 20 }} />
                            </ScrollView>

                            {/* Action Buttons */}
                            {selectedRequest && (
                                <View style={styles.modalActionBar}>
                                    {selectedRequest.status === 'PENDING' && (
                                        <TouchableOpacity
                                            style={[styles.modalActionButton, styles.modalCancelButton]}
                                            onPress={() => {
                                                setDetailModalVisible(false);
                                                setTimeout(() => handleCancelRequest(selectedRequest._id), 300);
                                            }}
                                            disabled={actionLoading === selectedRequest._id}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#FFF" />
                                            <Text style={styles.modalActionButtonText}>Hủy đơn</Text>
                                        </TouchableOpacity>
                                    )}

                                    {(selectedRequest.status === 'APPROVED' || selectedRequest.status === 'OVERDUE') && (
                                        <TouchableOpacity
                                            style={[styles.modalActionButton, styles.modalReturnButton]}
                                            onPress={() => {
                                                setDetailModalVisible(false);
                                                setTimeout(() => handleRequestReturn(selectedRequest._id), 300);
                                            }}
                                            disabled={actionLoading === selectedRequest._id}
                                        >
                                            <Ionicons name="return-up-back" size={20} color="#FFF" />
                                            <Text style={styles.modalActionButtonText}>Yêu cầu trả</Text>
                                        </TouchableOpacity>
                                    )}

                                    {selectedRequest.status === 'RETURNED' && (
                                        <TouchableOpacity
                                            style={[styles.modalActionButton, styles.modalReviewButton]}
                                            onPress={() => setReviewModalVisible(true)}
                                        >
                                            <Ionicons name="star" size={20} color="#FFF" />
                                            <Text style={styles.modalActionButtonText}>Đánh giá</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#666', fontSize: 14 }}>Không tìm thấy thông tin</Text>
                        </View>
                    )}
                </View>
            </Modal>

            {/* Review Modal */}
            <Modal
                visible={reviewModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.reviewModalOverlay}>
                    <View style={styles.reviewModalContent}>
                        <Text style={styles.reviewModalTitle}>Đánh giá thiết bị</Text>

                        {/* Rating Stars */}
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={40}
                                        color="#FFD700"
                                        style={{ marginHorizontal: 5 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Comment Input */}
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Nhập nhận xét của bạn..."
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {/* Buttons */}
                        <View style={styles.reviewModalButtons}>
                            <TouchableOpacity
                                style={[styles.reviewModalButton, styles.reviewCancelButton]}
                                onPress={() => {
                                    setReviewModalVisible(false);
                                    setRating(5);
                                    setComment('');
                                }}
                            >
                                <Text style={styles.reviewCancelButtonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.reviewModalButton, styles.reviewSubmitButton]}
                                onPress={handleSubmitReview}
                                disabled={actionLoading !== null}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.reviewSubmitButtonText}>Gửi đánh giá</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 16,
        borderRadius: 16,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    sectionContainer: {
        marginBottom: 12,
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sectionBody: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        paddingVertical: 20,
    },
    requestCard: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        overflow: 'hidden',
    },
    cardContent: {
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deviceImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    deviceImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    deviceTextContainer: {
        flex: 1,
    },
    deviceName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    deviceCode: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 6,
        gap: 6,
    },
    cancelButton: {
        backgroundColor: '#EF4444',
    },
    returnButton: {
        backgroundColor: '#10B981',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },

    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFF',
    },
    modalCloseButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    modalScrollView: {
        flex: 1,
    },
    modalStatusSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    modalStatusBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    modalStatusText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalSection: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    modalDeviceCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    modalDeviceImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    modalDeviceImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modalDeviceInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    modalDeviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    modalDeviceDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    modalCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
    },
    modalDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    modalLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
        flex: 1,
    },
    modalValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 8,
    },
    modalRejectCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2',
    },
    modalRejectText: {
        flex: 1,
        fontSize: 14,
        color: '#991B1B',
        lineHeight: 20,
    },
    modalActionBar: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFF',
    },
    modalActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    modalCancelButton: {
        backgroundColor: '#EF4444',
    },
    modalReturnButton: {
        backgroundColor: '#10B981',
    },
    modalReviewButton: {
        backgroundColor: '#F59E0B',
    },
    modalActionButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },

    // Review Modal styles
    reviewModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    reviewModalContent: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    reviewModalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 100,
        marginBottom: 20,
    },
    reviewModalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    reviewModalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewCancelButton: {
        backgroundColor: '#F3F4F6',
    },
    reviewSubmitButton: {
        backgroundColor: '#F59E0B',
    },
    reviewCancelButtonText: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '600',
    },
    reviewSubmitButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
