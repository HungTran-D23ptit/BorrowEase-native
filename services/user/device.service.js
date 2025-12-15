import { apiAxios } from '../rootApi';

export const getDevices = async (params = {}) => {
    try {
        const { page = 1, per_page = 10, status, search } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        if (status) queryParams.append('status', status);
        if (search) queryParams.append('search', search);

        const response = await apiAxios({
            method: 'get',
            url: `/user/device?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
    }
};

export const getDeviceDetail = async (deviceId, params = {}) => {
    try {
        const { page = 1, per_page = 5 } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        const response = await apiAxios({
            method: 'get',
            url: `/user/device/${deviceId}?${queryParams.toString()}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecommendedDevices = async () => {
    try {
        const response = await apiAxios({
            method: 'get',
            url: '/user/device/recommendations/me',
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recommended devices:', error);
        throw error;
    }
};
