import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as borrowRequestService from '../../../services/user/borrowRequest.service';
import * as deviceService from '../../../services/user/device.service';
import { showSuccess, showError } from '../../../services/ToastService';
import { getImageUrl } from '../../../services/rootApi';
import { styles } from './style';

export default function BorrowScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [purpose, setPurpose] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!id) {
        showError('Không tìm thấy thiết bị');
        router.back();
        return;
      }

      try {
        setLoading(true);
        const response = await deviceService.getDeviceDetail(id as string);
        setDevice(response);
      } catch (error: any) {
        console.error('Error fetching device:', error);
        showError(error?.response?.data?.message || 'Không thể tải thông tin thiết bị');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString();
  };

  const onChangeBorrow = (event: any, selectedDate?: Date) => {
    setShowBorrowPicker(false);
    if (selectedDate) {
      setBorrowDate(selectedDate);
      if (returnDate <= selectedDate) {
        const newReturnDate = new Date(selectedDate);
        newReturnDate.setDate(newReturnDate.getDate() + 1);
        setReturnDate(newReturnDate);
      }
    }
  };

  const onChangeReturn = (event: any, selectedDate?: Date) => {
    setShowReturnPicker(false);
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (device && quantity < device.quantity) setQuantity(quantity + 1);
  };

  const handleComplete = async () => {
    if (!purpose.trim()) {
      showError('Vui lòng nhập mục đích mượn');
      return;
    }

    if (returnDate <= borrowDate) {
      showError('Ngày trả phải sau ngày mượn!');
      return;
    }

    if (quantity < 1) {
      showError('Số lượng phải lớn hơn 0');
      return;
    }

    if (device && quantity > device.quantity) {
      showError(`Số lượng không được vượt quá ${device.quantity}`);
      return;
    }

    try {
      setSubmitting(true);

      const requestData = {
        quantity,
        borrow_date: formatDateISO(borrowDate),
        return_date: formatDateISO(returnDate),
        reason: purpose.trim(),
      };

      await borrowRequestService.createBorrowRequest(id as string, requestData);

      showSuccess('Đã gửi yêu cầu mượn thiết bị!');

      setTimeout(() => {
        router.back();
      }, 500);

    } catch (error: any) {
      console.error('Error creating borrow request:', error);
      showError(error?.response?.data?.message || 'Không thể gửi yêu cầu mượn');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666' }}>Không tìm thấy thiết bị</Text>
      </View>
    );
  }

  const imageUrl = device.image_url ? getImageUrl(device.image_url) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/user/explore' as any);
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mượn thiết bị</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.deviceCard}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.deviceImage} />
          ) : (
            <View style={[styles.deviceImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            </View>
          )}
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>{device.avg_rating ? device.avg_rating.toFixed(1) : 'N/A'}</Text>
              <Ionicons name="star" size={14} color="#FFD700" style={{ marginHorizontal: 4 }} />
              <Text style={styles.reviewCount}>({device.review_count || 0})</Text>
            </View>
            <Text style={styles.quantityLeft}>Còn lại: {device.quantity}</Text>
          </View>
        </View>

        {/* --- CHỌN THỜI GIAN MƯỢN --- */}
        <Text style={styles.label}>Thời gian mượn <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowBorrowPicker(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={20} color="#555" style={{ marginRight: 10 }} />
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={20} color="#555" style={{ marginRight: 10 }} />
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

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.completeButton, submitting && { opacity: 0.6 }]}
          onPress={handleComplete}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Text style={styles.completeButtonText}>Hoàn tất</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}