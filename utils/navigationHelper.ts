/**
 * Navigation Helper for User Section
 * 
 * Vấn đề: Expo Router Tabs - mỗi tab có stack riêng
 * Khi navigate từ Tab A → Screen X, và back, nó quay về Tab A
 * Nhưng user muốn quay về tab "đúng" của screen đó
 * 
 * Giải pháp: Track navigation source và navigate accordingly
 */

import { router } from 'expo-router';

/**
 * Navigate back with context awareness
 * @param fallbackRoute - Route to navigate if can't go back
 */
export const navigateBack = (fallbackRoute?: string) => {
    if (router.canGoBack()) {
        router.back();
    } else if (fallbackRoute) {
        router.replace(fallbackRoute as any);
    } else {
        router.replace('/user/home' as any);
    }
};

/**
 * Navigate to device detail from any tab
 * Always goes through explore tab for consistent back behavior
 */
export const navigateToDeviceDetail = (deviceId: string) => {
    router.push({
        pathname: '/user/device/[id]' as any,
        params: { id: deviceId, from: 'explore' }
    });
};

/**
 * Navigate to borrow form
 */
export const navigateToBorrow = (deviceId: string) => {
    router.push({
        pathname: '/user/borrow/[id]' as any,
        params: { id: deviceId, from: 'device' }
    });
};

/**
 * Navigate to profile edit
 */
export const navigateToProfileEdit = () => {
    router.push('/user/profile/edit' as any);
};

/**
 * Navigate to change password
 */
export const navigateToChangePassword = () => {
    router.push('/user/profile/change-password' as any);
};

/**
 * Handle back from device detail
 * Should go to explore tab
 */
export const backFromDeviceDetail = () => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace('/user/explore' as any);
    }
};

/**
 * Handle back from borrow form
 * Should go back to device detail or explore
 */
export const backFromBorrow = () => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace('/user/explore' as any);
    }
};

/**
 * Handle back from profile screens
 * Should go to profile tab
 */
export const backFromProfile = () => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace('/user/profile' as any);
    }
};
