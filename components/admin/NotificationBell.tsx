import { useUnreadCount } from '@/hooks/admin/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function NotificationBell() {
    const router = useRouter();
    const { count } = useUnreadCount();

    return (
        <TouchableOpacity
            onPress={() => router.push('/admin/notifications')}
            style={styles.container}
        >
            <Ionicons name="notifications-outline" size={26} color="#111" />
            {count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {count > 99 ? '99+' : count}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

export { NotificationBell };
export default NotificationBell;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 8,
        marginRight: 8,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
