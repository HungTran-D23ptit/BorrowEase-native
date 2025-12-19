import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as authService from '../../../services/user/auth.service';
import { showSuccess, showError } from '../../../services/ToastService';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSendOTP = async () => {
        if (!email.trim()) {
            showError('Vui lòng nhập email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Email không hợp lệ');
            return;
        }

        try {
            setLoading(true);
            await authService.userForgotPassword(email.trim());
            showSuccess('Mã OTP đã được gửi đến email của bạn');
            setStep('otp');
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể gửi mã OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp.trim()) {
            showError('Vui lòng nhập mã OTP');
            return;
        }

        if (otp.length !== 6) {
            showError('Mã OTP phải có 6 ký tự');
            return;
        }

        if (!newPassword.trim()) {
            showError('Vui lòng nhập mật khẩu mới');
            return;
        }

        if (newPassword.length < 6) {
            showError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            setLoading(true);
            await authService.userResetPassword(email, otp, newPassword, confirmPassword);
            showSuccess('Đặt lại mật khẩu thành công');
            router.replace('/auth/login' as any);
        } catch (error: any) {
            showError(error?.response?.data?.message || 'Không thể đặt lại mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => step === 'email' ? router.back() : setStep('email')}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Quên mật khẩu</Text>
                    <Text style={styles.subtitle}>
                        {step === 'email'
                            ? 'Nhập email để nhận mã xác thực'
                            : 'Nhập mã OTP và mật khẩu mới'}
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {step === 'email' ? (
                        <>
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={20} color="#999" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập email của bạn"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            {/* Send OTP Button */}
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSendOTP}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Gửi mã OTP</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* Email Display */}
                            <View style={styles.emailDisplay}>
                                <Ionicons name="mail" size={20} color="#334155" />
                                <Text style={styles.emailDisplayText}>{email}</Text>
                            </View>

                            {/* OTP Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Mã OTP</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="key-outline" size={20} color="#999" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập mã OTP 6 số"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            {/* New Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Mật khẩu mới</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#999" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showNewPassword}
                                        editable={!loading}
                                    />
                                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                        <Ionicons
                                            name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#999" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        editable={!loading}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Ionicons
                                            name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Resend OTP */}
                            <TouchableOpacity
                                style={styles.resendButton}
                                onPress={() => {
                                    setStep('email');
                                    setOtp('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                disabled={loading}
                            >
                                <Text style={styles.resendText}>Gửi lại mã OTP</Text>
                            </TouchableOpacity>

                            {/* Reset Password Button */}
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleResetPassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={20} color="#334155" />
                    <Text style={styles.infoText}>
                        {step === 'email'
                            ? 'Mã OTP sẽ được gửi đến email của bạn và có hiệu lực trong 5 phút'
                            : 'Nhập mã OTP đã được gửi đến email và tạo mật khẩu mới'}
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        marginBottom: 24,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    emailDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    emailDisplayText: {
        fontSize: 16,
        color: '#334155',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#334155',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resendButton: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    resendText: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#334155',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});
