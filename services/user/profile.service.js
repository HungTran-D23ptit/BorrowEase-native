import { apiAxios } from '../rootApi';

export const getProfile = async () => {
    const response = await apiAxios.get('/user/profile');
    return response.data;
};

export const getUserProfile = getProfile;

export const updateProfile = async (data) => {
    const response = await apiAxios.put('/user/profile', data);
    return response.data;
};

export const updateProfileWithAvatar = async (data, avatarUri) => {
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

    const response = await apiAxios.put('/user/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
