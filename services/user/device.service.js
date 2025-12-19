import { apiAxios } from '../rootApi';

const mapDeviceStatus = (device) => {
    let frontendStatus = 'available';
    if (device.status === 'MAINTENANCE') {
        frontendStatus = 'maintenance';
    } else if (device.quantity <= 0) {
        frontendStatus = 'unavailable';
    } else {
        frontendStatus = 'available';
    }

    return {
        ...device,
        status: frontendStatus,
        available_quantity: device.quantity || 0,
    };
};

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

        if (response.data?.data) {
            response.data.data = response.data.data.map(mapDeviceStatus);
        }

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

        const data = response.data;
        if (data) {
            return mapDeviceStatus(data);
        }

        return data;
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

        const devices = response.data?.result || [];

        const availableDevices = devices.filter(device => {
            return device.status !== 'MAINTENANCE' && device.quantity > 0;
        });

        const processedDevices = availableDevices.map(mapDeviceStatus);

        return { devices: processedDevices };
    } catch (error) {
        console.error('Error fetching recommended devices:', error);
        return { devices: [] };
    }
};
