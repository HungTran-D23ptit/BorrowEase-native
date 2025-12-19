import { uploadImage } from '@/services/admin/upload.service';
import { handleApiError } from '@/utils/errorHandler';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useImagePicker = () => {
    const [uploading, setUploading] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    // Request permissions
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Cần quyền truy cập',
                'Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình ảnh.'
            );
            return false;
        }
        return true;
    };

    // Chọn ảnh từ thư viện
    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return null;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                setImageUri(selectedImage.uri);
                return selectedImage;
            }
            return null;
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
            return null;
        }
    };

    // Chụp ảnh từ camera
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Cần quyền truy cập',
                'Ứng dụng cần quyền truy cập camera để chụp ảnh.'
            );
            return null;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const photo = result.assets[0];
                setImageUri(photo.uri);
                return photo;
            }
            return null;
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
            return null;
        }
    };

    // Upload ảnh lên server
    const uploadImageToServer = async (imageAsset) => {
        if (!imageAsset) {
            Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước khi upload');
            return null;
        }

        setUploading(true);
        try {
            // Tạo file object từ image asset
            const fileExtension = imageAsset.uri.split('.').pop();
            const fileName = `device-${Date.now()}.${fileExtension}`;

            const file = {
                uri: imageAsset.uri,
                name: fileName,
                type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
            };

            const response = await uploadImage(file);

            if (response && response.data) {
                // Giả sử API trả về { image_url: "..." }
                const uploadedUrl = response.data.image_url || response.data.url;
                return uploadedUrl;
            }
            return null;
        } catch (error) {
            handleApiError(error, 'Upload ảnh thất bại');
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Chọn và upload ảnh trong một bước
    const pickAndUploadImage = async () => {
        const image = await pickImage();
        if (image) {
            const uploadedUrl = await uploadImageToServer(image);
            return uploadedUrl;
        }
        return null;
    };

    // Chụp và upload ảnh trong một bước
    const takeAndUploadPhoto = async () => {
        const photo = await takePhoto();
        if (photo) {
            const uploadedUrl = await uploadImageToServer(photo);
            return uploadedUrl;
        }
        return null;
    };

    // Reset image
    const resetImage = () => {
        setImageUri(null);
    };

    return {
        imageUri,
        uploading,
        pickImage,
        takePhoto,
        uploadImageToServer,
        pickAndUploadImage,
        takeAndUploadPhoto,
        resetImage,
    };
};
