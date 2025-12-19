import { apiAdminAxios } from '../rootApi';

/**
 * Lấy thông tin profile của admin
 * @returns {Promise}
 */
export const getAdminProfile = async () => {
    const response = await apiAdminAxios.get('/admin/profile');
    return response.data;
};

/**
 * Cập nhật thông tin profile của admin
 * @param {Object} data 
 * @returns {Promise}
 */
export const updateAdminProfile = async (data) => {
    const response = await apiAdminAxios.put('/admin/profile', data);
    return response.data;
};

/**
 * Cập nhật profile admin kèm avatar
 * @param {Object} data - Dữ liệu profile
 * @param {string} avatarUri - URI của ảnh avatar
 * @returns {Promise} Updated profile data
 */
export const updateAdminProfileWithAvatar = async (data, avatarUri) => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    if (avatarUri) {
        const filename = avatarUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('avatar', {
            uri: avatarUri,
            name: filename,
            type: type,
        });
    }

    const response = await apiAdminAxios.put('/admin/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
