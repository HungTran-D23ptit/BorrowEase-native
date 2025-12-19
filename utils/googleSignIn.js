import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// ⚠️ QUAN TRỌNG: Lấy từ Google Cloud Console
// https://console.cloud.google.com/ → APIs & Services → Credentials
const GOOGLE_WEB_CLIENT_ID = '306704646002-0cjbqkv9g9aihgnkgm826hivphfk80g8.apps.googleusercontent.com';

// Android Client ID (nếu có)
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID';

// iOS Client ID (nếu có)  
const GOOGLE_IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID';

/**
 * Create Google Auth Request
 * Sử dụng hook này trong component
 */
export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
    });

    return {
        request,
        response,
        promptAsync,
    };
};

/**
 * Get user info from Google
 */
export const getUserInfo = async (accessToken) => {
    try {
        const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
};

/**
 * Exchange authorization code for tokens
 * Note: Expo AuthSession handles this automatically
 */
export const exchangeCodeForTokens = async (code) => {
    // This is handled by expo-auth-session automatically
    // Just return the code to send to backend
    return code;
};
