import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Lưu ý: Vì file nằm trong thư mục explore/ nên phải lùi ra 3 cấp để tìm components
import DeviceCard from '../../../components/DeviceCard';

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  background: '#FFFFFF',
  textMain: '#111111',
  textSecondary: '#666666',
  primary: '#007AFF',
  inputBg: '#F5F5F5', // Màu nền thanh tìm kiếm
  categoryBg: '#F0F2F5', // Màu nền của filter tab chưa chọn
};

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const BASE_DEVICES = [
    { id: 'D1', name: 'Camon EOS R5', description: 'Thiết bị điện thông minh giải pháp tự động...', quantity: 7, imageUrl: 'https://via.placeholder.com/150x150?text=Camera1' },
    { id: 'D2', name: 'Sony Alpha A7', description: 'Máy ảnh không gương lật full-frame...', quantity: 3, imageUrl: 'https://via.placeholder.com/150x150?text=Camera2' },
    { id: 'D3', name: 'Rode NT-USB', description: 'Microphone condenser USB đa năng...', quantity: 5, imageUrl: 'https://via.placeholder.com/150x150?text=Mic1' },
    { id: 'D4', name: 'DJI RS 3 Pro', description: 'Gimbal chống rung 3 trục...', quantity: 2, imageUrl: 'https://via.placeholder.com/150x150?text=Gimbal' },
];
// Nhân bản dữ liệu để danh sách dài ra
const MOCK_ALL_DEVICES = [...BASE_DEVICES, ...BASE_DEVICES.map(d => ({...d, id: d.id + '_2'})), ...BASE_DEVICES.map(d => ({...d, id: d.id + '_3'}))];

const CATEGORIES = ['Tất cả', 'Camera Recorder', 'Camera', 'Microphone', 'Lighting', 'Phụ kiện'];

export default function ExploreScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');

    return (
        <View style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* 1. HEADER TITLE */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Thiết bị sẵn có</Text>
                    <Text style={styles.headerSubtitle}>Xem và lựa chọn các thiết bị bạn muốn mượn</Text>
                </View>

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
                <View style={styles.gridContainer}>
                    {MOCK_ALL_DEVICES.map((device) => (
                        <DeviceCard key={device.id} device={device} />
                    ))}
                </View>
                 
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        paddingTop: 60,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        marginHorizontal: 20,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 12,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.textMain,
    },
    categoryContainer: {
        marginBottom: 20,
        paddingLeft: 20,
    },
    categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.categoryBg,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryItemSelected: {
        backgroundColor: COLORS.textMain,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    categoryTextSelected: {
        color: '#FFFFFF',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
});