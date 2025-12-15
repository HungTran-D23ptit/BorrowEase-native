import { apiAdminAxios } from "../rootApi";

export const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append('image', {
        uri: file.uri,
        name: file.name || 'device-image.jpg',
        type: file.type || 'image/jpeg',
    });

    const response = await apiAdminAxios({
        method: "post",
        url: "/admin/upload/image",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response;
};

export const uploadMultipleImages = async (files) => {
    const formData = new FormData();

    files.forEach((file, index) => {
        formData.append('images', {
            uri: file.uri,
            name: file.name || `device-image-${index}.jpg`,
            type: file.type || 'image/jpeg',
        });
    });

    const response = await apiAdminAxios({
        method: "post",
        url: "/admin/upload/images",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response;
};
