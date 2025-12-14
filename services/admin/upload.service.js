import { apiAdminAxios } from "../rootApi";

/**
 * Upload ảnh lên server
 * @param {Object} file - File object với uri, name, type
 * @returns {Promise} Response chứa URL của ảnh đã upload
 */
export const uploadImage = async (file) => {
    const formData = new FormData();

    // Tạo file object cho FormData
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

/**
 * Upload nhiều ảnh cùng lúc
 * @param {Array} files - Mảng các file objects
 * @returns {Promise} Response chứa mảng URLs của các ảnh đã upload
 */
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
