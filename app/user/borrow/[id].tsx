import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// 1. Import thư viện DatePicker
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

// Mock data
const DEVICE_INFO = {
  id: 'D001',
  name: 'Camon EOS R5',
  rating: 4.5,
  reviewCount: 2,
  quantityLeft: 7,
  image: 'https://via.placeholder.com/150x150?text=Camera', 
};

export default function BorrowScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // --- QUẢN LÝ NGÀY THÁNG ---
  // State lưu giá trị ngày (dạng Date object)
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  
  // State hiển thị bộ chọn (Chỉ dùng cho Android, iOS hiển thị kiểu khác nếu muốn)
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [purpose, setPurpose] = useState('');
  const [phone, setPhone] = useState('2666489213');
  const [quantity, setQuantity] = useState(1);

  // Hàm format ngày thành chuỗi "dd/mm/yyyy" để hiển thị đẹp
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Xử lý khi chọn ngày Mượn
  const onChangeBorrow = (event: any, selectedDate?: Date) => {
    setShowBorrowPicker(false); // Ẩn picker sau khi chọn
    if (selectedDate) {
      setBorrowDate(selectedDate);
    }
  };

  // Xử lý khi chọn ngày Trả
  const onChangeReturn = (event: any, selectedDate?: Date) => {
    setShowReturnPicker(false); // Ẩn picker sau khi chọn
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  // --- LOGIC KHÁC ---
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleIncrease = () => {
    if (quantity < DEVICE_INFO.quantityLeft) setQuantity(quantity + 1);
  };

  const handleComplete = () => {
    if (!purpose.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập mục đích mượn");
      return;
    }
    
    // Logic kiểm tra ngày trả phải sau ngày mượn (Optional)
    if (returnDate < borrowDate) {
        Alert.alert("Lỗi", "Ngày trả phải sau ngày mượn!");
        return;
    }

    Alert.alert("Thành công", "Đã gửi yêu cầu mượn thiết bị!", [
      { 
        text: "OK", 
        // 👇 ĐÃ SỬA: Chuyển về màn hình Quản lý
        onPress: () => router.replace('/user/management/index' as any) 
      } 
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mượn thiết bị</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.deviceCard}>
          <Image source={{ uri: DEVICE_INFO.image }} style={styles.deviceImage} />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{DEVICE_INFO.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>{DEVICE_INFO.rating}</Text>
              <Ionicons name="star" size={14} color="#FFD700" style={{marginHorizontal: 4}} />
              <Text style={styles.reviewCount}>({DEVICE_INFO.reviewCount})</Text>
            </View>
            <Text style={styles.quantityLeft}>Còn lại: {DEVICE_INFO.quantityLeft}</Text>
          </View>
        </View>

        {/* --- CHỌN THỜI GIAN MƯỢN --- */}
        <Text style={styles.label}>Thời gian mượn <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowBorrowPicker(true)}> 
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Ionicons name="calendar-outline" size={20} color="#555" style={{marginRight: 10}}/>
             {/* Hiển thị ngày đã chọn */}
             <Text style={styles.inputText}>{formatDate(borrowDate)}</Text>
           </View>
           <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>
        
        {/* Component Picker (Chỉ hiện khi showBorrowPicker = true) */}
        {showBorrowPicker && (
            <DateTimePicker
                value={borrowDate}
                mode="date"
                display="default"
                onChange={onChangeBorrow}
                minimumDate={new Date()} // Không cho chọn quá khứ
            />
        )}

        {/* --- CHỌN THỜI GIAN TRẢ --- */}
        <Text style={styles.label}>Thời gian trả <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowReturnPicker(true)}>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Ionicons name="calendar-outline" size={20} color="#555" style={{marginRight: 10}}/>
             {/* Hiển thị ngày đã chọn */}
             <Text style={styles.inputText}>{formatDate(returnDate)}</Text>
           </View>
           <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>

        {/* Component Picker (Chỉ hiện khi showReturnPicker = true) */}
        {showReturnPicker && (
            <DateTimePicker
                value={returnDate}
                mode="date"
                display="default"
                onChange={onChangeReturn}
                minimumDate={borrowDate} // Ngày trả phải sau hoặc bằng ngày mượn
            />
        )}

        {/* Mục đích mượn */}
        <Text style={styles.label}>Mục đích mượn <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputBox, styles.textAreaBox]}>
          <TextInput 
            style={styles.textArea}
            placeholder="Tôi mượn để ...."
            multiline={true}
            numberOfLines={4}
            value={purpose}
            onChangeText={setPurpose}
            textAlignVertical="top"
          />
        </View>

        {/* Số điện thoại */}
        <Text style={styles.label}>Số điện thoại của bạn <Text style={styles.required}>*</Text></Text>
        <View style={styles.inputBox}>
          <TextInput 
             style={{flex: 1, height: '100%'}}
             value={phone}
             onChangeText={setPhone}
             keyboardType="phone-pad"
          />
        </View>

        {/* Số lượng */}
        <View style={styles.quantityRow}>
          <Text style={styles.label}>Số lượng <Text style={styles.required}>*</Text></Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.counterButton}>
              <MaterialIcons name="remove" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.counterButton}>
              <MaterialIcons name="add" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      <View style={styles.bottomContainer}>
         <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
             <Text style={styles.completeButtonText}>Hoàn tất</Text>
             <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
         </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  deviceCard: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  deviceImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F5F5F5', marginRight: 15 },
  deviceInfo: { flex: 1, justifyContent: 'center' },
  deviceName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingText: { fontSize: 12, fontWeight: '600' },
  reviewCount: { fontSize: 12, color: '#888' },
  quantityLeft: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  required: { color: 'red' },
  inputBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, backgroundColor: '#fff' },
  inputText: { fontSize: 14, color: '#000' },
  placeholderText: { fontSize: 14, color: '#888' },
  textAreaBox: { height: 120, alignItems: 'flex-start', paddingTop: 12 },
  textArea: { flex: 1, height: '100%', textAlignVertical: 'top', fontSize: 14 },
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, padding: 4 },
  counterButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  counterValue: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 15, minWidth: 20, textAlign: 'center' },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  completeButton: { backgroundColor: '#00D2FF', height: 50, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: "#00D2FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  completeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
});