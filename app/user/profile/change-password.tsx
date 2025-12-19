import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as authService from '../../../services/user/auth.service';
import { showSuccess, showError } from '../../../services/ToastService';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword.trim()) {
            showError('Vui lòng nhập mật khẩu cũ');
            return;
        }

        if (!newPassword.trim()) {
            showError('Vui lòng nhập mật khẩu mới');
            return;
        }

        if (newPassword.length < 6) {
            showError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (oldPassword === newPassword) {
            showError('Mật khẩu mới phải khác mật khẩu cũ');
            return;
        }

        try {
            setLoading(true);
            await authService.userChangePassword(oldPassword, newPassword, confirmPassword);
            showSuccess('Đổi mật khẩu thành công');
            router.back();
        } catch (error: any) {
            console.error('Change password error:', error);
            showError(error?.response?.data?.message || 'Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

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
                    <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <Text style={styles.description}>
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                    </Text>

                    {/* Old Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu cũ <Text style={styles.required}>*</Text></Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                placeholder="Nhập mật khẩu cũ"
                                secureTextEntry={!showOldPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowOldPassword(!showOldPassword)}
                            >
                                <Ionicons
                                    name={showOldPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu mới <Text style={styles.required}>*</Text></Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Ionicons
                                    name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Xác nhận mật khẩu mới <Text style={styles.required}>*</Text></Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Nhập lại mật khẩu mới"
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Change Password Button */}
                    <TouchableOpacity
                        style={[styles.changeButton, loading && styles.changeButtonDisabled]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={styles.changeButtonText}>Đổi mật khẩu</Text>
                        )}
                    </TouchableOpacity>

                    {/* Security Tips */}
                    <View style={styles.tipsContainer}>
                        <Text style={styles.tipsTitle}>💡 Lưu ý bảo mật:</Text>
                        <Text style={styles.tipText}>• Mật khẩu phải có ít nhất 6 ký tự</Text>
                        <Text style={styles.tipText}>• Nên sử dụng kết hợp chữ hoa, chữ thường và số</Text>
                        <Text style={styles.tipText}>• Không sử dụng mật khẩu quá đơn giản</Text>
                        <Text style={styles.tipText}>• Thay đổi mật khẩu định kỳ để bảo mật tài khoản</Text>
                    </View>
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
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
    },
    eyeButton: {
        padding: 12,
    },
    changeButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
    },
    changeButtonDisabled: {
        opacity: 0.6,
    },
    changeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    tipsContainer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#FFF3EF',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B35',
    },
    tipsTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    tipText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
        lineHeight: 18,
    },
});
