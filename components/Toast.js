import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const Toast = ({ visible, message, type = 'success', onHide, duration = 3000 }) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
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

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    if (!visible) return null;

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    color: '#10B981',
                    backgroundColor: '#D1FAE5',
                    borderColor: '#10B981',
                };
            case 'error':
                return {
                    icon: 'close-circle',
                    color: '#EF4444',
                    backgroundColor: '#FEE2E2',
                    borderColor: '#EF4444',
                };
            case 'warning':
                return {
                    icon: 'warning',
                    color: '#F59E0B',
                    backgroundColor: '#FEF3C7',
                    borderColor: '#F59E0B',
                };
            case 'info':
                return {
                    icon: 'information-circle',
                    color: '#3B82F6',
                    backgroundColor: '#DBEAFE',
                    borderColor: '#3B82F6',
                };
            default:
                return {
                    icon: 'checkmark-circle',
                    color: '#10B981',
                    backgroundColor: '#D1FAE5',
                    borderColor: '#10B981',
                };
        }
    };

    const config = getToastConfig();

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
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={hideToast}
                style={[
                    styles.toastContent,
                    {
                        backgroundColor: config.backgroundColor,
                        borderLeftColor: config.borderColor,
                    },
                ]}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name={config.icon} size={24} color={config.color} />
                </View>

                <Text style={[styles.message, { color: config.color }]} numberOfLines={3}>
                    {message}
                </Text>

                <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color={config.color} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 16,
        right: 16,
        zIndex: 9999,
        elevation: 999,
    },
    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
});

export default Toast;
