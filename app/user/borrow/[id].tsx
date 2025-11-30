import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// 👇 Import styles từ file vừa tạo
import { styles } from './style';

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
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [purpose, setPurpose] = useState('');
  const [phone, setPhone] = useState('2666489213');
  const [quantity, setQuantity] = useState(1);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onChangeBorrow = (event: any, selectedDate?: Date) => {
    setShowBorrowPicker(false);
    if (selectedDate) {
      setBorrowDate(selectedDate);
    }
  };

  const onChangeReturn = (event: any, selectedDate?: Date) => {
    setShowReturnPicker(false);
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
    
    if (returnDate < borrowDate) {
        Alert.alert("Lỗi", "Ngày trả phải sau ngày mượn!");
        return;
    }

    Alert.alert("Thành công", "Đã gửi yêu cầu mượn thiết bị!", [
      { text: "OK", onPress: () => router.replace('/user/management/index' as any) } 
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
             <Text style={styles.inputText}>{formatDate(borrowDate)}</Text>
           </View>
           <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>
        
        {showBorrowPicker && (
            <DateTimePicker
                value={borrowDate}
                mode="date"
                display="default"
                onChange={onChangeBorrow}
                minimumDate={new Date()}
            />
        )}

        {/* --- CHỌN THỜI GIAN TRẢ --- */}
        <Text style={styles.label}>Thời gian trả <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowReturnPicker(true)}>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Ionicons name="calendar-outline" size={20} color="#555" style={{marginRight: 10}}/>
             <Text style={styles.inputText}>{formatDate(returnDate)}</Text>
           </View>
           <Ionicons name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>

        {showReturnPicker && (
            <DateTimePicker
                value={returnDate}
                mode="date"
                display="default"
                onChange={onChangeReturn}
                minimumDate={borrowDate}
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