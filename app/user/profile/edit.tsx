import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as profileService from '../../../services/user/profile.service';
import { showSuccess, showError } from '../../../services/ToastService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getImageUrl } from '../../../services/rootApi';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState<Date | null>(null);
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');
    const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
    const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setName(data.name || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setGender(data.gender || '');
            setAddress(data.address || '');
            setDepartment(data.department || '');
            setCurrentAvatar(data.avatar_url || null);
            if (data.dob) {
                setDob(new Date(data.dob));
            }
        } catch (error: any) {
            showError('Không thể tải thông tin');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            showError('Bạn cần cấp quyền truy cập thư viện ảnh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setNewAvatarUri(result.assets[0].uri);
        }
    };

    const removeAvatar = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc muốn xóa ảnh đại diện?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        setNewAvatarUri(null);
                        setCurrentAvatar(null);
                    },
                },
            ]
        );
    };

    const handleSave = async () => {
        if (!name.trim()) {
            showError('Vui lòng nhập họ tên');
            return;
        }

        try {
            setSaving(true);
            const updateData: any = {
                name: name.trim(),
                phone: phone.trim() || '',
                gender: gender || '',
                address: address.trim() || '',
                department: department.trim() || '',
            };

            if (dob) {
                updateData.dob = dob.toISOString();
            }

            if (newAvatarUri) {
                await profileService.updateProfileWithAvatar(updateData, newAvatarUri);
            } else if (currentAvatar === null && newAvatarUri === null) {
                updateData.avatar = 'remove';
                await profileService.updateProfile(updateData);
            } else {
                await profileService.updateProfile(updateData);
            }

            showSuccess('Cập nhật thông tin thành công');
            router.back();
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể cập nhật thông tin');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient
                colors={['#334155', '#475569']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/user/profile' as any);
                            }
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {newAvatarUri || currentAvatar ? (
                                <Image
                                    source={{ uri: newAvatarUri || getImageUrl(currentAvatar!) }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={48} color="#999" />
                                </View>
                            )}
                        </View>
                        <View style={styles.avatarButtons}>
                            <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
                                <Ionicons name="camera" size={20} color="#FF6B35" />
                                <Text style={styles.avatarButtonText}>
                                    {newAvatarUri || currentAvatar ? 'Đổi ảnh' : 'Chọn ảnh'}
                                </Text>
                            </TouchableOpacity>
                            {(newAvatarUri || currentAvatar) && (
                                <TouchableOpacity style={styles.avatarButtonRemove} onPress={removeAvatar}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    <Text style={styles.avatarButtonTextRemove}>Xóa ảnh</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Họ tên <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nhập họ tên"
                        />
                    </View>

                    {/* Email (readonly) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.inputDisabled]}
                            value={email}
                            editable={false}
                        />
                        <Text style={styles.helperText}>Email không thể thay đổi</Text>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Giới tính</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                                onPress={() => setGender('male')}
                            >
                                <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                                    Nam
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                                onPress={() => setGender('female')}
                            >
                                <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                                    Nữ
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
                                onPress={() => setGender('other')}
                            >
                                <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>
                                    Khác
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Date of Birth */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ngày sinh</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>
                                {dob ? dob.toLocaleDateString('vi-VN') : 'Chọn ngày sinh'}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dob || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(Platform.OS === 'ios');
                                if (selectedDate) {
                                    setDob(selectedDate);
                                }
                            }}
                        />
                    )}

                    {/* Department */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Khoa</Text>
                        <TextInput
                            style={styles.input}
                            value={department}
                            onChangeText={setDepartment}
                            placeholder="Nhập khoa"
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Nhập địa chỉ"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    scrollView: {
        flex: 1,
    },
    form: {
        padding: 16,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 16,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FF6B35',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderStyle: 'dashed',
    },
    avatarButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    avatarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFF3EF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF6B35',
    },
    avatarButtonText: {
        color: '#FF6B35',
        fontSize: 14,
        fontWeight: '600',
    },
    avatarButtonRemove: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    avatarButtonTextRemove: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
    },
    inputDisabled: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    textArea: {
        minHeight: 80,
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    genderButtonActive: {
        borderColor: '#FF6B35',
        backgroundColor: '#FFF3EF',
    },
    genderText: {
        fontSize: 14,
        color: '#666',
    },
    genderTextActive: {
        color: '#FF6B35',
        fontWeight: '600',
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    dateText: {
        fontSize: 15,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
