import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title = 'Xác nhận',
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'warning',
    onConfirm,
    onCancel,
}) => {
    const scaleValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleValue, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        } else {
            scaleValue.setValue(0);
        }
    }, [visible]);

    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'alert-circle',
                    iconColor: '#EF4444',
                    iconBg: '#FEE2E2',
                    confirmBg: '#EF4444',
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: '#F59E0B',
                    iconBg: '#FEF3C7',
                    confirmBg: '#F59E0B',
                };
            case 'info':
                return {
                    icon: 'information-circle',
                    iconColor: '#3B82F6',
                    iconBg: '#DBEAFE',
                    confirmBg: '#3B82F6',
                };
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    iconColor: '#10B981',
                    iconBg: '#D1FAE5',
                    confirmBg: '#10B981',
                };
            default:
                return {
                    icon: 'warning',
                    iconColor: '#F59E0B',
                    iconBg: '#FEF3C7',
                    confirmBg: '#F59E0B',
                };
        }
    };

    const config = getTypeConfig();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onCancel}
                />

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale: scaleValue }],
                        },
                    ]}
                >
                    <View style={styles.modalContent}>
                        {/* Icon */}
                        <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
                            <Ionicons name={config.icon} size={48} color={config.iconColor} />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>{title}</Text>

                        {/* Message */}
                        <Text style={styles.message}>{message}</Text>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onCancel}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton, { backgroundColor: config.confirmBg }]}
                                onPress={() => {
                                    onConfirm();
                                    onCancel();
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.confirmButtonText}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    confirmButton: {
        backgroundColor: '#EF4444',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6B7280',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default ConfirmModal;
