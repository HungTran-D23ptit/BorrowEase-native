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
