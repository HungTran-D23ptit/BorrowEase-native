import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

// Mock data cho thiết bị
const BASE_DEVICES = [
  {
    id: 'D1',
    name: 'Canon EOS R5',
    category: 'Camera',
    status: 'available',
    quantity: 5,
    totalQuantity: 8,
    location: 'Phòng A101'
  },
  {
    id: 'D2',
    name: 'Sony A7 III',
    category: 'Camera',
    status: 'borrowed',
    quantity: 1,
    totalQuantity: 4,
    location: 'Phòng A102'
  },
  {
    id: 'D3',
    name: 'Rode NT-USB',
    category: 'Microphone',
    status: 'available',
    quantity: 8,
    totalQuantity: 10,
    location: 'Phòng B201'
  },
  {
    id: 'D4',
    name: 'DJI RS 3 Pro',
    category: 'Gimbal',
    status: 'maintenance',
    quantity: 0,
    totalQuantity: 3,
    location: 'Phòng C301'
  },
  {
    id: 'D5',
    name: 'Godox SL-60W',
    category: 'Lighting',
    status: 'available',
    quantity: 6,
    totalQuantity: 6,
    location: 'Phòng B202'
  },
];

const CATEGORIES = ['Tất cả', 'Camera', 'Microphone', 'Gimbal', 'Lighting'];

const STATUS_CONFIG = {
  available: { label: 'Sẵn có', color: '#4CAF50', bgColor: '#E8F5E9' },
  borrowed: { label: 'Đang mượn', color: '#2196F3', bgColor: '#E3F2FD' },
  maintenance: { label: 'Bảo trì', color: '#FF9800', bgColor: '#FFF3E0' },
};

export default function AdminDevices() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [devices] = useState(BASE_DEVICES);

  const handleDevicePress = (device: any) => {
    router.push(`/admin/devices/${device.id}` as any);
  };

  const handleAddDevice = () => {
    Alert.alert('Thêm thiết bị', 'Tính năng thêm thiết bị mới đang được phát triển');
  };

  const renderDeviceCard = ({ item }: { item: any }) => {
    const statusInfo = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];

    return (
      <TouchableOpacity
        style={styles.deviceCard}
        onPress={() => handleDevicePress(item)}
      >
        <View style={styles.deviceHeader}>
          <View style={[styles.deviceIcon, { backgroundColor: statusInfo.bgColor }]}>
            <MaterialCommunityIcons
              name="devices"
              size={24}
              color={statusInfo.color}
            />
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceCategory}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.deviceDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="package-variant" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.quantity}/{item.totalQuantity} có sẵn
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Quản lý thiết bị</Text>
          <Text style={styles.headerSubtitle}>Xem và quản lý tất cả thiết bị trong hệ thống</Text>
        </View>

        {/* THANH TÌM KIẾM VÀ NÚT THÊM */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm thiết bị..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* BỘ LỌC DANH MỤC */}
        <View style={styles.categoryContainer}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isSelected = item === selectedCategory;
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    isSelected && styles.categoryItemSelected
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* DANH SÁCH THIẾT BỊ */}
        <View style={styles.devicesSection}>
          <Text style={styles.sectionTitle}>
            Tất cả thiết bị ({devices.length})
          </Text>

          <FlatList
            data={devices}
            renderItem={renderDeviceCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.devicesList}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
