import { useDevices } from '@/hooks/user/useDevices';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DeviceCard from '../../../components/DeviceCard';

// 👇 Import styles từ file bên cạnh
import { styles } from './style';

interface Device {
    _id: string;
    name: string;
    description?: string;
    image_url?: string;
    status: 'available' | 'borrowed' | 'maintenance' | 'unavailable';
    category?: string;
    quantity?: number;
    available_quantity?: number;
}

const CATEGORIES = ['Tất cả', 'Camera Recorder', 'Camera', 'Microphone', 'LED Studio Light', 'Computer', 'Projector', 'Other'];

export default function ExploreScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Use the devices hook
    const { devices, loading, error, refresh, updateParams } = useDevices({
        page: 1,
        per_page: 20,
    });

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText]);

    // Update API params when search changes (not category, we filter on FE)
    useEffect(() => {
        const params: any = {
            page: 1,
            per_page: 100, // Get more items to filter on FE
        };

        if (debouncedSearch) {
            params.search = debouncedSearch;
        }

        updateParams(params);
    }, [debouncedSearch]);

    // Filter devices by category on frontend
    const filteredDevices = React.useMemo(() => {
        if (!devices) return [];

        if (selectedCategory === 'Tất cả') {
            return devices;
        }

        return devices.filter((device: any) => device.type === selectedCategory);
    }, [devices, selectedCategory]);

    return (
        <View style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refresh}
                        colors={['#334155']}
                    />
                }
            >

                {/* 1. GRADIENT HEADER */}
                <LinearGradient
                    colors={['#334155', '#475569']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <Text style={styles.headerTitle}>Thiết bị sẵn có</Text>
                    <Text style={styles.headerSubtitle}>Xem và lựa chọn các thiết bị bạn muốn mượn</Text>
                </LinearGradient>

                {/* 2. THANH TÌM KIẾM */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm tên thiết bị"
                        placeholderTextColor="#888"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* 3. BỘ LỌC DANH MỤC */}
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
                            )
                        }}
                    />
                </View>

                {/* 4. LƯỚI THIẾT BỊ */}
                {error ? (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" />
                        <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={refresh}
                            style={{
                                marginTop: 16,
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                backgroundColor: '#334155',
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                ) : loading && filteredDevices.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <ActivityIndicator size="large" color="#334155" />
                        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 12 }}>
                            Đang tải thiết bị...
                        </Text>
                    </View>
                ) : filteredDevices.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <MaterialCommunityIcons name="inbox-outline" size={64} color="#D1D5DB" />
                        <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>
                            Không tìm thấy thiết bị nào
                        </Text>
                    </View>
                ) : (
                    <View style={styles.gridContainer}>
                        {(filteredDevices as Device[]).map((device) => (
                            <DeviceCard key={device._id} device={device} />
                        ))}
                    </View>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}
