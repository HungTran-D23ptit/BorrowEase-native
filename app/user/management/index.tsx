import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DeviceCard from '../../../components/DeviceCard';
import { useRouter } from 'expo-router'; // 1. Import Router

// Bật Animation cho Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- MOCK DATA THIẾT BỊ ---
const MOCK_DATA = {
    pending: [
        { id: 'P1', name: 'Camon EOS R5', description: 'Thiết bị điện thông minh...', quantity: 7, imageUrl: 'https://via.placeholder.com/150x150?text=Camera' },
        { id: 'P2', name: 'Sony Alpha', description: 'Máy ảnh Sony...', quantity: 2, imageUrl: 'https://via.placeholder.com/150x150?text=Sony' },
    ],
    overdue: [
        { id: 'O1', name: 'Mic Rode', description: 'Mic thu âm...', quantity: 1, imageUrl: 'https://via.placeholder.com/150x150?text=Mic' },
    ],
    borrowing: [
        { id: 'B1', name: 'Gimbal DJI', description: 'Chống rung...', quantity: 1, imageUrl: 'https://via.placeholder.com/150x150?text=Gimbal' },
    ],
    cancelled: [],
    returned: [
        { id: 'R1', name: 'Lens Canon', description: 'Ống kính...', quantity: 1, imageUrl: 'https://via.placeholder.com/150x150?text=Lens' },
    ]
};

// --- DANH MỤC THIẾT BỊ ---
const CATEGORY_LIST = ['Camera Recorder', 'Camera', 'Microphone', 'Lighting', 'Phụ kiện', 'Khác'];

// --- DANH SÁCH TRẠNG THÁI ---
const STATUS_LIST = ['Chờ duyệt', 'Quá hạn', 'Đang mượn', 'Đã hủy', 'Đã trả'];

export default function ManagementScreen() {
    const router = useRouter(); // 2. Khởi tạo Router
    const [searchText, setSearchText] = useState('');
    const [expandedSection, setExpandedSection] = useState<string | null>('pending');
    
    const [activeFilter, setActiveFilter] = useState('all'); 
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Xử lý khi bấm vào nút bộ lọc
    const handleFilterPress = (filterType: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        if (filterType === 'category') {
            if (activeFilter === 'category' && showCategoryDropdown) {
                setShowCategoryDropdown(false);
            } else {
                setActiveFilter('category');
                setShowCategoryDropdown(true);
                setShowStatusDropdown(false); 
            }
        } else if (filterType === 'status') {
            if (activeFilter === 'status' && showStatusDropdown) {
                setShowStatusDropdown(false);
            } else {
                setActiveFilter('status');
                setShowStatusDropdown(true);
                setShowCategoryDropdown(false); 
            }
        } else {
            setActiveFilter(filterType);
            setShowCategoryDropdown(false); 
            setShowStatusDropdown(false);
        }
    };

    const handleSelectDropdownItem = (item: string, type: 'category' | 'status') => {
        console.log(`Đã chọn ${type}:`, item);
        setShowCategoryDropdown(false);
        setShowStatusDropdown(false);
    };

    const toggleSection = (section: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSection(expandedSection === section ? null : section);
    };

    const renderSection = (title: string, data: any[], sectionKey: string) => {
        const isOpen = expandedSection === sectionKey;
        const count = data.length;

        return (
            <View style={styles.sectionContainer}>
                <TouchableOpacity 
                    style={styles.sectionHeader} 
                    onPress={() => toggleSection(sectionKey)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sectionTitle}>{title} ({count})</Text>
                    <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
                </TouchableOpacity>

                {isOpen && (
                    <View style={styles.sectionBody}>
                        {count === 0 ? (
                            <Text style={styles.emptyText}>Không có thiết bị nào</Text>
                        ) : (
                            <View style={styles.gridContainer}>
                                {data.map((device) => (
                                    // 👇 ĐOẠN CODE QUAN TRỌNG ĐÃ ĐƯỢC THÊM 👇
                                    <TouchableOpacity 
                                        key={device.id}
                                        activeOpacity={0.9}
                                        onPress={() => router.push(`/user/management/detail/${device.id}` as any)}
                                    >
                                        {/* Chặn sự kiện của con để cha nhận click */}
                                        <View pointerEvents="none">
                                            <DeviceCard device={device} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thiết bị đã mượn</Text>
                <Text style={styles.headerSubtitle}>Xem và lựa chọn các thiết bị bạn muốn mượn</Text>
                
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

                <View style={styles.filterRow}>
                    <TouchableOpacity onPress={() => handleFilterPress('all')}>
                        <Text style={[styles.filterLabel, activeFilter === 'all' && styles.filterLabelActive]}>
                            Tất cả
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('category')}>
                        <Text style={[styles.filterButtonText, activeFilter === 'category' && styles.filterLabelActive]}>
                            Danh mục
                        </Text>
                        <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={14} color={activeFilter === 'category' ? "#000" : "#333"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('status')}>
                        <Text style={[styles.filterButtonText, activeFilter === 'status' && styles.filterLabelActive]}>
                            Trạng thái
                        </Text>
                        <Ionicons name={showStatusDropdown ? "chevron-up" : "chevron-down"} size={14} color={activeFilter === 'status' ? "#000" : "#333"} />
                    </TouchableOpacity>
                </View>

                {showCategoryDropdown && (
                    <View style={[styles.dropdownContainer, { left: 90 }]}> 
                        {CATEGORY_LIST.map((cat, index) => (
                            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectDropdownItem(cat, 'category')}>
                                <Text style={styles.dropdownText}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {showStatusDropdown && (
                    <View style={[styles.dropdownContainer, { left: 200 }]}> 
                        {STATUS_LIST.map((status, index) => (
                            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectDropdownItem(status, 'status')}>
                                <Text style={styles.dropdownText}>{status}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {renderSection("Chờ duyệt", MOCK_DATA.pending, 'pending')}
                {renderSection("Quá hạn", MOCK_DATA.overdue, 'overdue')}
                {renderSection("Đang mượn", MOCK_DATA.borrowing, 'borrowing')}
                {renderSection("Đã hủy", MOCK_DATA.cancelled, 'cancelled')}
                {renderSection("Đã trả", MOCK_DATA.returned, 'returned')}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { backgroundColor: '#FFF', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', zIndex: 10 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 5 },
    headerSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 25, paddingHorizontal: 15, height: 45, marginBottom: 15 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: '100%', fontSize: 15 },
    
    filterRow: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    filterLabel: { fontSize: 15, fontWeight: '400', color: '#333', marginRight: 20 },
    filterButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    filterButtonText: { fontSize: 15, color: '#333', marginRight: 4, fontWeight: '400' },
    filterLabelActive: { fontWeight: 'bold', color: '#000' },

    dropdownContainer: {
        position: 'absolute',
        top: 215,
        width: 150, 
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        paddingVertical: 0,
        zIndex: 100,
    },
    dropdownItem: { paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    dropdownText: { fontSize: 13, color: '#333' },

    scrollView: { paddingTop: 15, paddingHorizontal: 15 },
    sectionContainer: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
    sectionBody: { paddingTop: 0, paddingBottom: 15, paddingHorizontal: 15, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 10, fontStyle: 'italic' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
});