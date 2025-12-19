import CustomToast from '@/components/CustomToast';
import { useBorrowRequestActions, useBorrowRequestDetail, useBorrowRequests, useBorrowRequestStats } from '@/hooks/admin/useBorrowRequests';
import { useNotificationModal } from '@/hooks/useNotificationModal';
import { getImageUrl } from '@/services/rootApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { styles } from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type BorrowStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'RETURNING' | 'RETURNED' | 'OVERDUE';

const STATUS_CONFIG: Record<BorrowStatus, { label: string; color: string; bgColor: string }> = {
    PENDING: { label: 'Chờ duyệt', color: '#FF9500', bgColor: '#FFF3E0' },
    APPROVED: { label: 'Đang mượn', color: '#007AFF', bgColor: '#E3F2FD' },
    REJECTED: { label: 'Từ chối', color: '#FF3B30', bgColor: '#FFEBEE' },
    CANCELLED: { label: 'Đã hủy', color: '#8E8E93', bgColor: '#F5F5F5' },
    RETURNING: { label: 'Đang trả', color: '#5856D6', bgColor: '#EDE7F6' },
    RETURNED: { label: 'Đã trả', color: '#34C759', bgColor: '#E8F5E9' },
    OVERDUE: { label: 'Quá hạn', color: '#FF3B30', bgColor: '#FFEBEE' },
};

export default function BorrowingManagementScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSection, setExpandedSection] = useState<BorrowStatus | null>('PENDING');
    const [rejectNote, setRejectNote] = useState('');
    const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [confirmReturnModal, setConfirmReturnModal] = useState<{ visible: boolean; id: string | null }>({ visible: false, id: null });

    const { modalState, showError, showSuccess, hideModal } = useNotificationModal();

    const { stats } = useBorrowRequestStats();

    const { request: detailRequest, loading: detailLoading, refresh: refreshDetail } = useBorrowRequestDetail(selectedRequestId);

    const { approveRequest, rejectRequest, confirmReturn, loading: actionLoading } = useBorrowRequestActions({
        onSuccess: showSuccess,
        onError: showError,
    });

    const pendingData = useBorrowRequests('PENDING');
    const approvedData = useBorrowRequests('APPROVED');
    const returningData = useBorrowRequests('RETURNING');
    const overdueData = useBorrowRequests('OVERDUE');
    const returnedData = useBorrowRequests('RETURNED');
    const rejectedData = useBorrowRequests('REJECTED');

    const statusDataMap: Partial<Record<BorrowStatus, ReturnType<typeof useBorrowRequests>>> = {
        PENDING: pendingData,
        APPROVED: approvedData,
        RETURNING: returningData,
        OVERDUE: overdueData,
        RETURNED: returnedData,
        REJECTED: rejectedData,
    };

    useEffect(() => {
        if (params.requestId && typeof params.requestId === 'string') {
            setSelectedRequestId(params.requestId);
            setDetailModalVisible(true);
        }
    }, [params.requestId]);

    const toggleSection = (section: BorrowStatus) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleApprove = async (id: string) => {
        try {
            await approveRequest(id);
            pendingData.refresh();
            approvedData.refresh();
        } catch (error) {
        }
    };

    const handleRejectClick = (id: string) => {
        setRejectingRequestId(id);
    };

    const handleRejectSubmit = async () => {
        try {
            await rejectRequest(rejectingRequestId, rejectNote);
            setRejectingRequestId(null);
            setRejectNote('');
            pendingData.refresh();
            rejectedData.refresh();
        } catch (error) {
        }
    };

    const handleConfirmReturn = async (id: string) => {
        setConfirmReturnModal({ visible: true, id });
    };

    const handleConfirmReturnSubmit = async () => {
        if (!confirmReturnModal.id) return;

        try {
            await confirmReturn(confirmReturnModal.id);
            setConfirmReturnModal({ visible: false, id: null });
            returningData.refresh();
            returnedData.refresh();
        } catch (error) {
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const renderRequestCard = (item: any, status: BorrowStatus) => {
        const device = item.device || {};
        const user = item.user || {};
        const deviceImageUrl = device.image_url ? getImageUrl(device.image_url) : null;

        return (
            <View key={item._id} style={styles.requestCard}>
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() => {
                        setSelectedRequest(item);
                        setSelectedRequestId(item._id);
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
                                    <MaterialCommunityIcons name="devices" size={24} color="#334155" />
                                </View>
                            )}
                            <View style={styles.deviceTextContainer}>
                                <Text style={styles.deviceName} numberOfLines={1}>
                                    {device.name || 'N/A'}
                                </Text>
                                <Text style={styles.deviceCode}>
                                    Mã: {device.code || 'N/A'} | SL: {item.quantity || 0}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </View>

                    <View style={styles.userRow}>
                        <Ionicons name="person-outline" size={16} color="#666" />
                        <Text style={styles.userText} numberOfLines={1}>
                            {user.name || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.dateRow}>
                        <View style={styles.dateItem}>
                            <MaterialCommunityIcons name="calendar-export" size={16} color="#007AFF" />
                            <Text style={styles.dateText}>{formatDate(item.borrow_date)}</Text>
                        </View>
                        <View style={styles.dateItem}>
                            <MaterialCommunityIcons name="calendar-import" size={16} color="#334155" />
                            <Text style={styles.dateText}>{formatDate(item.return_date)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {status === 'PENDING' && (
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={[styles.quickActionBtn, styles.approveBtn]}
                            onPress={() => handleApprove(item._id)}
                            disabled={actionLoading}
                        >
                            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                            <Text style={styles.quickActionText}>Duyệt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickActionBtn, styles.rejectBtn]}
                            onPress={() => handleRejectClick(item._id)}
                            disabled={actionLoading}
                        >
                            <Ionicons name="close-circle" size={18} color="#FFF" />
                            <Text style={styles.quickActionText}>Từ chối</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {status === 'RETURNING' && (
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={[styles.quickActionBtn, styles.confirmBtn]}
                            onPress={() => handleConfirmReturn(item._id)}
                            disabled={actionLoading}
                        >
                            <MaterialCommunityIcons name="keyboard-return" size={18} color="#FFF" />
                            <Text style={styles.quickActionText}>Xác nhận đã trả</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderSection = (status: BorrowStatus) => {
        const config = STATUS_CONFIG[status];
        const data = statusDataMap[status];
        const isOpen = expandedSection === status;
        const count = data?.requests.length ?? 0;

        const filteredRequests = data?.requests.filter((req: any) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                req.device?.name?.toLowerCase().includes(query) ||
                req.user?.name?.toLowerCase().includes(query) ||
                req.user?.email?.toLowerCase().includes(query)
            );
        }) ?? [];

        return (
            <View key={status} style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(status)}
                    activeOpacity={0.7}
                >
                    <View style={styles.sectionTitleRow}>
                        <View style={[styles.sectionDot, { backgroundColor: config.color }]} />
                        <Text style={styles.sectionTitle}>{config.label} ({count})</Text>
                    </View>
                    <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
                </TouchableOpacity>

                {isOpen && (
                    <View style={styles.sectionBody}>
                        {data?.loading && filteredRequests.length === 0 ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#334155" />
                                <Text style={styles.loadingText}>Đang tải...</Text>
                            </View>
                        ) : filteredRequests.length === 0 ? (
                            <Text style={styles.emptyText}>Không có yêu cầu nào</Text>
                        ) : (
                            <View style={styles.cardsContainer}>
                                {filteredRequests.map((item: any) => renderRequestCard(item, status))}
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const totalRequests = stats
        ? Object.values(stats).reduce((sum: number, val) => sum + (val as number), 0)
        : 0;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            Object.values(statusDataMap).forEach((data: any) => data.refresh());
                        }}
                        colors={['#334155']}
                    />
                }
            >
                {/* GRADIENT HEADER */}
                <LinearGradient
                    colors={['#1E293B', '#334155']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <Text style={styles.headerTitle}>Quản lý mượn trả</Text>
                    <Text style={styles.headerSubtitle}>
                        {totalRequests} đơn mượn trong hệ thống
                    </Text>
                </LinearGradient>

                {/* STATS CARDS */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#FF9500' }]}>
                            <Ionicons name="time-outline" size={20} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{stats?.PENDING || 0}</Text>
                        <Text style={styles.statLabel}>Chờ duyệt</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#FF3B30' }]}>
                            <Ionicons name="alert-circle-outline" size={20} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{stats?.OVERDUE || 0}</Text>
                        <Text style={styles.statLabel}>Quá hạn</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#007AFF' }]}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{stats?.APPROVED || 0}</Text>
                        <Text style={styles.statLabel}>Đang mượn</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#34C759' }]}>
                            <Ionicons name="checkmark-done-outline" size={20} color="#FFF" />
                        </View>
                        <Text style={styles.statValue}>{stats?.RETURNED || 0}</Text>
                        <Text style={styles.statLabel}>Đã trả</Text>
                    </View>
                </View>

                {/* SEARCH */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm theo tên thiết bị, người dùng..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* SECTIONS */}
                <View style={styles.scrollView}>
                    {renderSection('PENDING')}
                    {renderSection('OVERDUE')}
                    {renderSection('APPROVED')}
                    {renderSection('RETURNING')}
                    {renderSection('RETURNED')}
                    {renderSection('REJECTED')}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {rejectingRequestId && (
                <View style={styles.rejectModal}>
                    <View style={styles.rejectModalContent}>
                        <Text style={styles.rejectModalTitle}>Lý do từ chối</Text>
                        <TextInput
                            style={styles.rejectInput}
                            placeholder="Nhập lý do từ chối..."
                            value={rejectNote}
                            onChangeText={setRejectNote}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                        <View style={styles.rejectModalActions}>
                            <TouchableOpacity
                                style={[styles.rejectModalBtn, styles.cancelBtn]}
                                onPress={() => {
                                    setRejectingRequestId(null);
                                    setRejectNote('');
                                }}
                            >
                                <Text style={styles.cancelBtnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rejectModalBtn, styles.submitBtn]}
                                onPress={handleRejectSubmit}
                                disabled={actionLoading || !rejectNote.trim()}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Xác nhận</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* CONFIRM RETURN MODAL */}
            {confirmReturnModal.visible && (
                <View style={styles.rejectModal}>
                    <View style={styles.rejectModalContent}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                <MaterialCommunityIcons name="keyboard-return" size={40} color="#007AFF" />
                            </View>
                            <Text style={styles.rejectModalTitle}>Xác nhận đã trả</Text>
                            <Text style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
                                Bạn đã nhận lại thiết bị từ người dùng?
                            </Text>
                        </View>
                        <View style={styles.rejectModalActions}>
                            <TouchableOpacity
                                style={[styles.rejectModalBtn, styles.cancelBtn]}
                                onPress={() => setConfirmReturnModal({ visible: false, id: null })}
                                disabled={actionLoading}
                            >
                                <Text style={styles.cancelBtnText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rejectModalBtn, { backgroundColor: '#007AFF' }]}
                                onPress={handleConfirmReturnSubmit}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Xác nhận</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Detail Modal */}
            <Modal
                visible={detailModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => {
                    setDetailModalVisible(false);
                    setSelectedRequestId(null);
                }}
            >
                <View style={styles.modalContainer}>
                    {/* Modal Header with Gradient */}
                    <LinearGradient
                        colors={['#1E293B', '#334155']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalHeaderGradient}
                    >
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                onPress={() => {
                                    setDetailModalVisible(false);
                                    setSelectedRequestId(null);
                                }}
                                style={styles.modalCloseButton}
                            >
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.modalHeaderTitle}>Chi tiết đơn mượn</Text>
                            <View style={{ width: 40 }} />
                        </View>
                    </LinearGradient>

                    {detailLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#334155" />
                            <Text style={{ marginTop: 16, color: '#666', fontSize: 14 }}>Đang tải...</Text>
                        </View>
                    ) : detailRequest ? (
                        <>
                            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                                {/* Status Badge */}
                                <View style={styles.modalStatusSection}>
                                    <View
                                        style={[
                                            styles.modalStatusBadge,
                                            { backgroundColor: STATUS_CONFIG[detailRequest.status as BorrowStatus]?.bgColor },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.modalStatusText,
                                                { color: STATUS_CONFIG[detailRequest.status as BorrowStatus]?.color },
                                            ]}
                                        >
                                            {STATUS_CONFIG[detailRequest.status as BorrowStatus]?.label}
                                        </Text>
                                    </View>
                                </View>

                                {/* Device Information */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Thông tin thiết bị</Text>
                                    <View style={styles.modalDeviceCard}>
                                        {detailRequest.device?.image_url ? (
                                            <Image
                                                source={{ uri: getImageUrl(detailRequest.device.image_url) }}
                                                style={styles.modalDeviceImage}
                                            />
                                        ) : (
                                            <View style={styles.modalDeviceImagePlaceholder}>
                                                <MaterialCommunityIcons name="devices" size={48} color="#334155" />
                                            </View>
                                        )}
                                        <View style={styles.modalDeviceInfo}>
                                            <Text style={styles.modalDeviceName}>{detailRequest.device?.name || 'N/A'}</Text>
                                            <View style={styles.modalInfoRow}>
                                                <Ionicons name="barcode-outline" size={16} color="#666" />
                                                <Text style={styles.modalInfoText}>Mã: {detailRequest.device?.code || 'N/A'}</Text>
                                            </View>

                                            <View style={styles.modalInfoRow}>
                                                <MaterialCommunityIcons name="warehouse" size={16} color="#666" />
                                                <Text style={styles.modalInfoText}>
                                                    Còn lại trong kho: {detailRequest.device?.quantity ?? 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* User Information */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Thông tin người mượn</Text>
                                    <View style={styles.modalCard}>
                                        <View style={styles.modalDetailRow}>
                                            <Ionicons name="person-outline" size={20} color="#334155" />
                                            <Text style={styles.modalLabel}>Họ tên:</Text>
                                            <Text style={styles.modalValue}>{detailRequest.user?.name || 'N/A'}</Text>
                                        </View>
                                        <View style={styles.modalDivider} />
                                        <View style={styles.modalDetailRow}>
                                            <Ionicons name="mail-outline" size={20} color="#334155" />
                                            <Text style={styles.modalLabel}>Email:</Text>
                                            <Text style={styles.modalValue}>{detailRequest.user?.email || 'N/A'}</Text>
                                        </View>
                                        {detailRequest.user?.phone && (
                                            <>
                                                <View style={styles.modalDivider} />
                                                <View style={styles.modalDetailRow}>
                                                    <Ionicons name="call-outline" size={20} color="#334155" />
                                                    <Text style={styles.modalLabel}>SĐT:</Text>
                                                    <Text style={styles.modalValue}>{detailRequest.user.phone}</Text>
                                                </View>
                                            </>
                                        )}
                                        <View style={styles.modalDivider} />
                                        <View style={styles.modalDetailRow}>
                                            <MaterialCommunityIcons name="package-variant" size={20} color="#007AFF" />
                                            <Text style={styles.modalLabel}>Số lượng mượn:</Text>
                                            <Text style={[styles.modalValue, { color: '#007AFF', fontWeight: '600' }]}>{detailRequest.quantity || 0}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Borrow Information */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Thông tin mượn trả</Text>
                                    <View style={styles.modalCard}>
                                        <View style={styles.modalDetailRow}>
                                            <MaterialCommunityIcons name="calendar-export" size={20} color="#007AFF" />
                                            <Text style={styles.modalLabel}>Ngày mượn:</Text>
                                            <Text style={styles.modalValue}>{formatDate(detailRequest.borrow_date)}</Text>
                                        </View>
                                        <View style={styles.modalDivider} />
                                        <View style={styles.modalDetailRow}>
                                            <MaterialCommunityIcons name="calendar-import" size={20} color="#334155" />
                                            <Text style={styles.modalLabel}>Ngày trả:</Text>
                                            <Text style={styles.modalValue}>{formatDate(detailRequest.return_date)}</Text>
                                        </View>
                                        {detailRequest.reason && (
                                            <>
                                                <View style={styles.modalDivider} />
                                                <View style={styles.modalDetailRow}>
                                                    <MaterialCommunityIcons name="note-text-outline" size={20} color="#334155" />
                                                    <Text style={styles.modalLabel}>Lý do mượn:</Text>
                                                    <Text style={styles.modalValue} numberOfLines={2}>{detailRequest.reason}</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </View>

                                {/* Rejection Reason */}
                                {detailRequest.note && detailRequest.status === 'REJECTED' && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Lý do từ chối</Text>
                                        <View style={[styles.modalCard, styles.modalRejectCard]}>
                                            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                                            <Text style={styles.modalRejectText}>{detailRequest.note}</Text>
                                        </View>
                                    </View>
                                )}

                                <View style={{ height: 100 }} />
                            </ScrollView>

                            {/* Action Buttons */}
                            {detailRequest?.status === 'PENDING' && (
                                <View style={styles.modalActionBar}>
                                    <TouchableOpacity
                                        style={[styles.modalActionButton, styles.modalRejectButton]}
                                        onPress={() => {
                                            setDetailModalVisible(false);
                                            setTimeout(() => handleRejectClick(detailRequest?._id || ''), 300);
                                        }}
                                        disabled={actionLoading}
                                    >
                                        <Ionicons name="close-circle" size={20} color="#FFF" />
                                        <Text style={styles.modalActionButtonText}>Từ chối</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalActionButton, styles.modalApproveButton]}
                                        onPress={async () => {
                                            await handleApprove(detailRequest?._id || '');
                                            setDetailModalVisible(false);
                                        }}
                                        disabled={actionLoading}
                                    >
                                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                        <Text style={styles.modalActionButtonText}>Duyệt đơn</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {detailRequest?.status === 'RETURNING' && (
                                <View style={styles.modalActionBar}>
                                    <TouchableOpacity
                                        style={[styles.modalActionButton, styles.modalConfirmButton]}
                                        onPress={async () => {
                                            await handleConfirmReturn(detailRequest?._id || '');
                                            setDetailModalVisible(false);
                                        }}
                                        disabled={actionLoading}
                                    >
                                        <MaterialCommunityIcons name="keyboard-return" size={20} color="#FFF" />
                                        <Text style={styles.modalActionButtonText}>Xác nhận đã trả</Text>
                                    </TouchableOpacity>
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

            {/* Custom Toast Notification */}
            <CustomToast
                visible={modalState.visible}
                type={modalState.type as 'error' | 'warning' | 'info' | 'success'}
                message={modalState.message}
                onClose={hideModal}
            />
        </View>
    );
}

