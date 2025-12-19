import { useState, useEffect, useCallback } from 'react';
import * as profileService from '@/services/admin/profile.service';
import { useToast } from '@/contexts/ToastContext';

/**
 * @typedef {Object} AdminProfile
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} avatar
 * @property {string} role
 * @property {string} gender
 * @property {string} dob
 * @property {string} address
 * @property {string} department
 */

/**
 * Hook để quản lý profile của admin
 */
export const useAdminProfile = () => {
    const [profile, setProfile] = useState(/** @type {AdminProfile | null} */(null));
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { showSuccess, showError } = useToast();

    /**
     * Fetch profile data
     */
    const fetchProfile = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await profileService.getAdminProfile();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching admin profile:', error);
            showError(error?.response?.data?.message || 'Không thể tải thông tin profile');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [showError]);

    /**
     * Update profile
     */
    const updateProfile = useCallback(async (data, avatarUri = null) => {
        try {
            setLoading(true);

            let result;
            if (avatarUri) {
                result = await profileService.updateAdminProfileWithAvatar(data, avatarUri);
            } else {
                result = await profileService.updateAdminProfile(data);
            }

            setProfile(result.user || result);
            showSuccess(result.message || 'Cập nhật thông tin thành công');
            return result;
        } catch (error) {
            console.error('Error updating admin profile:', error);
            showError(error?.response?.data?.message || 'Không thể cập nhật thông tin');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [showSuccess, showError]);

    /**
     * Refresh profile
     */
    const refresh = useCallback(() => {
        fetchProfile(true);
    }, [fetchProfile]);

    // Load profile on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        refreshing,
        updateProfile,
        refresh,
        refetch: fetchProfile,
    };
};
