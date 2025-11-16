import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Hoahoang',
    email: 'hghoa2005@gmail.com',
    phone: '2666489213',
    address: 'Nhà 100, ngõ 109, hqv ....',
  });

  const handleDeleteAccount = () => {
    setMenuVisible(false);
    Alert.alert('Xác nhận xóa tài khoản', 'Bạn có chắc chắn muốn xóa tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đồng ý', style: 'destructive', onPress: () => console.log('Tài khoản bị xóa') },
    ]);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    navigation.replace('Login');
  };

  const handlePasswordChange = () => {
    setIsEditing(false);
    setShowPasswordModal(true);
  };

  const saveProfile = () => {
    setIsEditing(false);
    Alert.alert('Thông báo', 'Thông tin cá nhân đã được lưu.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuDots}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Menu modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuVisible(false)} />
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setIsEditing(true); }}>
            <Text style={styles.menuText}>Chỉnh sửa thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemDestructive} onPress={handleDeleteAccount}>
            <Text style={styles.menuTextDestructive}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{formData.name[0]}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{formData.name}</Text>
            <Text style={styles.joined}>Tham gia vào ngày 04 tháng 3 năm 2025</Text>
          </View>
          <TouchableOpacity style={styles.editSmall} onPress={() => setIsEditing(true)}>
            <Text style={styles.editSmallText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{formData.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{formData.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Địa chỉ</Text>
          <Text style={styles.value}>{formData.address}</Text>
        </View>

        <TouchableOpacity style={styles.changePwd} onPress={handlePasswordChange}>
          <Text style={styles.changePwdText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</Text>
            <ScrollView>
              <TouchableOpacity style={styles.avatarEdit}>
                <Text style={styles.avatarEditText}>Thay đổi ảnh đại diện</Text>
              </TouchableOpacity>

              <Text style={styles.fieldLabel}>Họ và tên</Text>
              <TextInput style={styles.input} value={formData.name} onChangeText={(t) => setFormData({ ...formData, name: t })} />
              <Text style={styles.caption}>Caption content</Text>

              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput style={styles.input} value={formData.email} onChangeText={(t) => setFormData({ ...formData, email: t })} keyboardType="email-address" />
              <Text style={styles.caption}>Caption content</Text>

              <Text style={styles.fieldLabel}>Số điện thoại</Text>
              <TextInput style={styles.input} value={formData.phone} onChangeText={(t) => setFormData({ ...formData, phone: t })} keyboardType="phone-pad" />
              <Text style={styles.caption}>Caption content</Text>

              <Text style={styles.fieldLabel}>Địa chỉ</Text>
              <TextInput style={styles.input} value={formData.address} onChangeText={(t) => setFormData({ ...formData, address: t })} />
              <Text style={styles.caption}>Caption content</Text>

              <View style={{ height: 12 }} />
              <View style={styles.modalActionsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                  <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}