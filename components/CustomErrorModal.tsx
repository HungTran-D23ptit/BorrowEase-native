import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface CustomErrorModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
    type?: 'error' | 'warning' | 'info' | 'success';
}

const MODAL_CONFIG = {
    error: {
        icon: 'close-circle' as const,
        color: '#FF3B30',
        bgColor: '#FFEBEE',
        gradient: ['#FF6B6B', '#FF3B30'],
    },
    warning: {
        icon: 'warning' as const,
        color: '#FF9500',
        bgColor: '#FFF3E0',
        gradient: ['#FFB84D', '#FF9500'],
    },
    info: {
        icon: 'information-circle' as const,
        color: '#007AFF',
        bgColor: '#E3F2FD',
        gradient: ['#4DA6FF', '#007AFF'],
    },
    success: {
        icon: 'checkmark-circle' as const,
        color: '#34C759',
        bgColor: '#E8F5E9',
        gradient: ['#5DD879', '#34C759'],
    },
};

export default function CustomErrorModal({
    visible,
    title,
    message,
    onClose,
    type = 'error',
}: CustomErrorModalProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const config = MODAL_CONFIG[type];

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
            pulseAnim.setValue(1);

            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={handleClose}
                />

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Icon Container */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: config.bgColor },
                            { transform: [{ scale: pulseAnim }] },
                        ]}
                    >
                        <View
                            style={[
                                styles.iconInnerCircle,
                                { backgroundColor: config.color },
                            ]}
                        >
                            <Ionicons name={config.icon} size={48} color="#FFF" />
                        </View>
                    </Animated.View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>
                            {title || (type === 'error' ? 'Lỗi' : type === 'warning' ? 'Cảnh báo' : type === 'success' ? 'Thành công' : 'Thông báo')}
                        </Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: config.color }]}
                        onPress={handleClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>

                    {/* Decorative Elements */}
                    <View style={[styles.decorativeCircle1, { backgroundColor: config.bgColor }]} />
                    <View style={[styles.decorativeCircle2, { backgroundColor: config.bgColor }]} />
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: width - 60,
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconInnerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 8,
    },
    closeButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        top: -50,
        right: -50,
        opacity: 0.1,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        bottom: -30,
        left: -30,
        opacity: 0.1,
    },
});
