import { ImagePickerButton } from '@/components/ImagePickerButton';
import { useDeviceActions, useDeviceDetail, useDeviceTypes } from '@/hooks/admin/useDevices';
import { getImageUrl } from '@/services/rootApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './detail-styles';

const STATUS_CONFIG = {
    NORMAL: { label: 'Sẵn có', color: '#4CAF50', bgColor: '#E8F5E9', icon: 'check-circle' },
    MAINTENANCE: { label: 'Bảo trì', color: '#FF9800', bgColor: '#FFF3E0', icon: 'wrench' },
};

export default function AdminDeviceDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: '',
        description: '',
        quantity: '1',
        image_url: '',
        status: 'NORMAL',
    });

    const { device, reviews, loading, refreshing, reviewsPagination, refresh, loadMoreReviews } = useDeviceDetail(id as string);
    const { updateDevice, deleteDevice, markMaintenance, loading: actionLoading } = useDeviceActions();
    const { types } = useDeviceTypes();

    const handleEdit = () => {
        if (device) {
            setFormData({
                name: device.name || '',
                code: device.code || '',
                type: device.type || '',
                description: device.description || '',
                quantity: device.quantity?.toString() || '1',
                image_url: device.image_url || '',
                status: device.status || 'NORMAL',
            });
            setEditModalVisible(true);
        }
    };

    const handleUpdateDevice = async () => {
        if (!formData.name || !formData.code || !formData.type) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (!device) return;

        const changedFields: any = {};

        if (formData.name !== device.name) {
            changedFields.name = formData.name;
        }
        if (formData.type !== device.type) {
            changedFields.type = formData.type;
        }
        if (formData.description !== (device.description || '')) {
            changedFields.description = formData.description;
        }
        if (parseInt(formData.quantity) !== device.quantity) {
            changedFields.quantity = parseInt(formData.quantity) || 1;
        }
        if (formData.image_url !== (device.image_url || '')) {
            changedFields.image_url = formData.image_url;
        }
        if (formData.status !== device.status) {
            changedFields.status = formData.status;
        }

        if (Object.keys(changedFields).length === 0) {
            Alert.alert('Thông báo', 'Không có thay đổi nào để cập nhật');
            setEditModalVisible(false);
            return;
        }

        try {
            await updateDevice(id as string, changedFields);
            setEditModalVisible(false);
            refresh();
        } catch (error) {
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa thiết bị này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDevice(id as string);
                            router.push('/admin/devices');
                        } catch (error) {
                        }
                    },
                },
            ]
        );
    };

    const handleMarkMaintenance = () => {
        Alert.alert(
            'Đánh dấu bảo trì',
            'Bạn có muốn chuyển thiết bị này sang trạng thái bảo trì?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            await markMaintenance(id as string);
                            refresh();
                        } catch (error) {
                        }
                    },
                },
            ]
        );
    };

    const renderReviewItem = ({ item }: any) => {
        const userName = item.user?.name || 'Người dùng';
        const userAvatar = item.user?.avatar;

        return (
            <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                        {userAvatar ? (
                            <Image
                                source={{ uri: getImageUrl(userAvatar) }}
                                style={styles.reviewAvatar}
                            />
                        ) : (
                            <MaterialCommunityIcons name="account-circle" size={40} color="#666" />
                        )}
                        <View style={styles.reviewUserDetails}>
                            <Text style={styles.reviewUserName}>{userName}</Text>
                            <Text style={styles.reviewDate}>
                                {new Date(item.created_at).toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= (item.rating || 0) ? 'star' : 'star-outline'}
                                size={16}
                                color="#FFB800"
                            />
                        ))}
                    </View>
                </View>
                {item.comment && <Text style={styles.reviewComment}>{item.comment}</Text>}
            </View>
        );
    };

    if (loading && !device) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#334155" />
                <Text style={styles.loadingText}>Đang tải thông tin thiết bị...</Text>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
                <Text style={styles.errorText}>Không tìm thấy thiết bị</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/admin/devices')}>
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusInfo = STATUS_CONFIG[device.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.NORMAL;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#334155']} />}
            >
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.push('/admin/devices')}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    {device.image_url ? (
                        <Image source={{ uri: getImageUrl(device.image_url) }} style={styles.mainImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <MaterialCommunityIcons name="devices" size={80} color="#CCC" />
                        </View>
                    )}
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.deviceName}>{device.name}</Text>
                            <Text style={styles.categoryText}>{device.type}</Text>
                            <Text style={styles.deviceCode}>Mã: {device.code}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                            <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                {statusInfo.label}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.quickInfoContainer}>
                        <View style={styles.quickInfoItem}>
                            <MaterialCommunityIcons name="package-variant" size={20} color="#666" />
                            <Text style={styles.quickInfoLabel}>Số lượng</Text>
                            <Text style={styles.quickInfoValue}>{device.quantity}</Text>
                        </View>
                        <View style={styles.quickInfoDivider} />
                        <View style={styles.quickInfoItem}>
                            <MaterialCommunityIcons name="star" size={20} color="#FFB800" />
                            <Text style={styles.quickInfoLabel}>Đánh giá</Text>
                            <Text style={styles.quickInfoValue}>{device.avg_rating?.toFixed(1) || 'N/A'}</Text>
                        </View>
                    </View>

                    {device.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Mô tả</Text>
                            <Text style={styles.descriptionText}>{device.description}</Text>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Đánh giá ({reviewsPagination.totalItems})</Text>
                        {reviews.length > 0 ? (
                            <FlatList
                                data={reviews}
                                renderItem={renderReviewItem}
                                keyExtractor={(item, index) => `${item._id || index}`}
                                scrollEnabled={false}
                                onEndReached={loadMoreReviews}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={
                                    loading && reviews.length > 0 ? (
                                        <ActivityIndicator size="small" color="#334155" style={{ marginVertical: 20 }} />
                                    ) : null
                                }
                            />
                        ) : (
                            <View style={styles.emptyReviews}>
                                <MaterialCommunityIcons name="comment-off-outline" size={48} color="#CCC" />
                                <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit} disabled={actionLoading}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
                    <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                {device.status !== 'MAINTENANCE' && (
                    <TouchableOpacity style={styles.statusButton} onPress={handleMarkMaintenance} disabled={actionLoading}>
                        <MaterialCommunityIcons name="wrench" size={20} color="#FF9800" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={actionLoading}>
                    <MaterialCommunityIcons name="delete" size={20} color="#F44336" />
                </TouchableOpacity>
            </View>

            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chỉnh sửa thiết bị</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Tên thiết bị *</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Nhập tên thiết bị"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Mã thiết bị *</Text>
                                <TextInput
                                    style={[styles.formInput, styles.formInputDisabled]}
                                    placeholder="Nhập mã thiết bị"
                                    value={formData.code}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Loại thiết bị *</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.typeSelector}>
                                        {types.map((type) => (
                                            <TouchableOpacity
                                                key={type}
                                                style={[
                                                    styles.typeOption,
                                                    formData.type === type && styles.typeOptionActive,
                                                ]}
                                                onPress={() => setFormData({ ...formData, type })}
                                            >
                                                <Text
                                                    style={[
                                                        styles.typeOptionText,
                                                        formData.type === type && styles.typeOptionTextActive,
                                                    ]}
                                                >
                                                    {type}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Số lượng *</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Nhập số lượng"
                                    keyboardType="numeric"
                                    value={formData.quantity}
                                    onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Trạng thái</Text>
                                <View style={styles.statusSelector}>
                                    <TouchableOpacity
                                        style={[
                                            styles.statusOption,
                                            formData.status === 'NORMAL' && styles.statusOptionActive,
                                        ]}
                                        onPress={() => setFormData({ ...formData, status: 'NORMAL' })}
                                    >
                                        <Text
                                            style={[
                                                styles.statusOptionText,
                                                formData.status === 'NORMAL' && styles.statusOptionTextActive,
                                            ]}
                                        >
                                            Sẵn có
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.statusOption,
                                            formData.status === 'MAINTENANCE' && styles.statusOptionActive,
                                        ]}
                                        onPress={() => setFormData({ ...formData, status: 'MAINTENANCE' })}
                                    >
                                        <Text
                                            style={[
                                                styles.statusOptionText,
                                                formData.status === 'MAINTENANCE' && styles.statusOptionTextActive,
                                            ]}
                                        >
                                            Bảo trì
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Mô tả</Text>
                                <TextInput
                                    style={[styles.formInput, styles.formTextArea]}
                                    placeholder="Nhập mô tả thiết bị"
                                    multiline
                                    numberOfLines={4}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                />
                            </View>

                            <ImagePickerButton
                                label="Hình ảnh thiết bị"
                                value={formData.image_url}
                                onImageSelected={(url) => setFormData({ ...formData, image_url: url })}
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSubmit]}
                                onPress={handleUpdateDevice}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.modalButtonTextSubmit}>Cập nhật</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
