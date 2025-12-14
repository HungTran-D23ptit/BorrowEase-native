import { ImagePickerButton } from '@/components/ImagePickerButton';
import { useToast } from '@/contexts/ToastContext';
import { useDeviceActions, useDevices, useDeviceTypes } from '@/hooks/admin/useDevices';
import { getImageUrl } from '@/services/rootApi';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { styles } from './styles';

const STATUS_CONFIG = {
  NORMAL: { label: 'Sẵn có', color: '#34C759', bgColor: '#E8F5E9', icon: 'check-circle' },
  MAINTENANCE: { label: 'Bảo trì', color: '#FF9500', bgColor: '#FFF3E0', icon: 'wrench' },
};

export default function AdminDevices() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    description: '',
    quantity: '1',
    image_url: '',
  });
  const { showSuccess, showError } = useToast();

  const { devices, loading, refreshing, pagination, updateFilters, refresh, loadMore } = useDevices();
  const { types } = useDeviceTypes();
  const { createDevice, loading: actionLoading } = useDeviceActions();

  const stats = useMemo(() => {
    const total = devices.length;
    const normal = devices.filter(d => d.status === 'NORMAL').length;
    const maintenance = devices.filter(d => d.status === 'MAINTENANCE').length;
    return { total, normal, maintenance };
  }, [devices]);

  const handleSearch = (text) => {
    setSearchText(text);
    updateFilters({ search: text });
  };

  const handleTypeFilter = (type) => {
    const newType = selectedType === type ? '' : type;
    setSelectedType(newType);
    updateFilters({ type: newType });
  };

  const handleStatusFilter = (status) => {
    const newStatus = selectedStatus === status ? '' : status;
    setSelectedStatus(newStatus);
    updateFilters({ status: newStatus });
  };

  const handleDevicePress = (device) => {
    router.push(`/admin/devices/${device._id}` as any);
  };

  const handleAddDevice = () => {
    setModalVisible(true);
  };

  const handleCreateDevice = async () => {
    if (!formData.name || !formData.code || !formData.type) {
      showError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await createDevice({
        ...formData,
        quantity: parseInt(formData.quantity) || 1,
      });
      setModalVisible(false);
      setFormData({
        name: '',
        code: '',
        type: '',
        description: '',
        quantity: '1',
        image_url: '',
      });
      refresh();
    } catch (error) {
      // Error handled in hook
    }
  };

  const renderDeviceCard = ({ item }) => {
    const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG.NORMAL;
    const availableQuantity = item.quantity || 0;

    return (
      <TouchableOpacity
        style={styles.deviceCard}
        onPress={() => handleDevicePress(item)}
        activeOpacity={0.7}
      >
        {/* Device Image */}
        <View style={styles.deviceImageContainer}>
          {item.image_url ? (
            <Image
              source={{ uri: getImageUrl(item.image_url) }}
              style={styles.deviceImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.deviceImagePlaceholder, { backgroundColor: statusInfo.bgColor }]}>
              <MaterialCommunityIcons
                name="devices"
                size={40}
                color={statusInfo.color}
              />
            </View>
          )}
          {/* Status Badge on Image */}
          <View style={[styles.statusBadgeOnImage, { backgroundColor: statusInfo.color }]}>
            <MaterialCommunityIcons
              name={statusInfo.icon}
              size={12}
              color="#FFF"
            />
          </View>
        </View>

        {/* Device Info */}
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.deviceCode} numberOfLines={1}>
            {item.code}
          </Text>
          <View style={styles.deviceFooter}>
            <View style={styles.deviceType}>
              <MaterialCommunityIcons name="tag-outline" size={14} color="#9CA3AF" />
              <Text style={styles.deviceTypeText} numberOfLines={1}>
                {item.type}
              </Text>
            </View>
            <View style={styles.deviceQuantity}>
              <MaterialCommunityIcons name="package-variant" size={14} color="#334155" />
              <Text style={styles.deviceQuantityText}>{availableQuantity}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="package-variant-closed" size={80} color="#E0E0E0" />
      <Text style={styles.emptyText}>Không tìm thấy thiết bị nào</Text>
      <Text style={styles.emptySubtext}>
        {searchText ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm thiết bị mới'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#334155']} />
        }
      >
        {/* HEADER WITH GRADIENT */}
        <LinearGradient
          colors={['#1E293B', '#334155']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Quản lý thiết bị</Text>
          <Text style={styles.headerSubtitle}>
            {pagination.totalItems} thiết bị trong hệ thống
          </Text>
        </LinearGradient>

        {/* STATS CARDS */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#007AFF' }]}>
              <MaterialCommunityIcons name="devices" size={24} color="#FFF" />
            </View>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Tổng thiết bị</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#34C759' }]}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#FFF" />
            </View>
            <Text style={styles.statValue}>{stats.normal}</Text>
            <Text style={styles.statLabel}>Sẵn có</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FF9500' }]}>
              <MaterialCommunityIcons name="wrench" size={24} color="#FFF" />
            </View>
            <Text style={styles.statValue}>{stats.maintenance}</Text>
            <Text style={styles.statLabel}>Bảo trì</Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm thiết bị..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={handleSearch}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* TYPE FILTER */}
        {types.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>
              <MaterialCommunityIcons name="shape-outline" size={16} color="#6B7280" /> Loại thiết bị
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={[styles.filterChip, !selectedType && styles.filterChipActive]}
                  onPress={() => handleTypeFilter('')}
                >
                  <Text style={[styles.filterText, !selectedType && styles.filterTextActive]}>
                    Tất cả
                  </Text>
                </TouchableOpacity>
                {types.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
                    onPress={() => handleTypeFilter(type)}
                  >
                    <Text style={[styles.filterText, selectedType === type && styles.filterTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* STATUS FILTER */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>
            <MaterialCommunityIcons name="filter-outline" size={16} color="#6B7280" /> Trạng thái
          </Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterChip, !selectedStatus && styles.filterChipActive]}
              onPress={() => handleStatusFilter('')}
            >
              <Text style={[styles.filterText, !selectedStatus && styles.filterTextActive]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedStatus === 'NORMAL' && styles.filterChipActive]}
              onPress={() => handleStatusFilter('NORMAL')}
            >
              <MaterialCommunityIcons name="check-circle" size={16} color={selectedStatus === 'NORMAL' ? '#FFF' : '#34C759'} />
              <Text style={[styles.filterText, selectedStatus === 'NORMAL' && styles.filterTextActive]}>
                Sẵn có
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedStatus === 'MAINTENANCE' && styles.filterChipActive]}
              onPress={() => handleStatusFilter('MAINTENANCE')}
            >
              <MaterialCommunityIcons name="wrench" size={16} color={selectedStatus === 'MAINTENANCE' ? '#FFF' : '#FF9500'} />
              <Text style={[styles.filterText, selectedStatus === 'MAINTENANCE' && styles.filterTextActive]}>
                Bảo trì
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DEVICES GRID */}
        {loading && devices.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải thiết bị...</Text>
          </View>
        ) : (
          <FlatList
            data={devices}
            renderItem={renderDeviceCard}
            keyExtractor={(item) => item._id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.devicesList}
            columnWrapperStyle={styles.devicesRow}
            ListEmptyComponent={renderEmptyList}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && devices.length > 0 ? (
                <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
              ) : null
            }
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fab} onPress={handleAddDevice} activeOpacity={0.8}>
        <LinearGradient
          colors={['#334155', '#475569']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* CREATE DEVICE MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm thiết bị mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                  style={styles.formInput}
                  placeholder="Nhập mã thiết bị"
                  value={formData.code}
                  onChangeText={(text) => setFormData({ ...formData, code: text })}
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
                <Text style={styles.formLabel}>Số lượng</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nhập số lượng"
                  keyboardType="numeric"
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                />
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
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSubmit]}
                onPress={handleCreateDevice}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.modalButtonTextSubmit}>Tạo thiết bị</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
