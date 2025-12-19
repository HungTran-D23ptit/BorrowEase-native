import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface CustomToastProps {
    visible: boolean;
    message: string;
    type?: 'error' | 'warning' | 'info' | 'success';
    onClose: () => void;
    duration?: number;
}

const TOAST_CONFIG = {
    error: {
        icon: 'close-circle' as const,
        bgColor: '#FFCDD2',
        textColor: '#C62828',
        iconColor: '#D32F2F',
    },
    warning: {
        icon: 'warning' as const,
        bgColor: '#FFE0B2',
        textColor: '#E65100',
        iconColor: '#F57C00',
    },
    info: {
        icon: 'information-circle' as const,
        bgColor: '#BBDEFB',
        textColor: '#1565C0',
        iconColor: '#1976D2',
    },
    success: {
        icon: 'checkmark-circle' as const,
        bgColor: '#C8E6C9',
        textColor: '#2E7D32',
        iconColor: '#388E3C',
    },
};

export default function CustomToast({
    visible,
    message,
    type = 'success',
    onClose,
    duration = 3000,
}: CustomToastProps) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isShowing, setIsShowing] = React.useState(false);

    const config = TOAST_CONFIG[type];

    useEffect(() => {
        if (visible) {
            setIsShowing(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, duration);
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsShowing(false);
            });
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    if (!visible && !isShowing) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={[styles.toast, { backgroundColor: config.bgColor }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name={config.icon} size={24} color={config.iconColor} />
                </View>
                <Text style={[styles.message, { color: config.textColor }]} numberOfLines={2}>
                    {message}
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color={config.textColor} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        width: width - 32,
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
});
