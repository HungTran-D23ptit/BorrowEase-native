import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { clearAllTokens } from '../../utils/localStorage';
import * as authService from '../../services/user/auth.service';

export default function LogoutScreen() {
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Try to call logout API
                await authService.userLogout();
            } catch (error) {
                console.error('Logout API error:', error);
                // Continue anyway
            }

            // Clear all tokens
            await clearAllTokens();

            // Small delay to ensure storage is cleared
            setTimeout(() => {
                // Navigate to login with replace to prevent back
                router.replace('/auth/login' as any);
            }, 500);
        };

        performLogout();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.text}>Đang đăng xuất...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});
