import { useImagePicker } from '@/hooks/useImagePicker';
import { getImageUrl } from '@/services/rootApi';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ImagePickerButton = ({ value, onImageSelected, label = "Chọn ảnh" }) => {
    const { imageUri, uploading, pickAndUploadImage, takeAndUploadPhoto } = useImagePicker();

    const handleImagePick = () => {
        Alert.alert(
            'Chọn ảnh',
            'Bạn muốn chọn ảnh từ đâu?',
            [
                {
                    text: 'Thư viện',
                    onPress: async () => {
                        const url = await pickAndUploadImage();
                        if (url && onImageSelected) {
                            onImageSelected(url);
                        }
                    },
                },
                {
                    text: 'Chụp ảnh',
                    onPress: async () => {
                        const url = await takeAndUploadPhoto();
                        if (url && onImageSelected) {
                            onImageSelected(url);
                        }
                    },
                },
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
            ]
        );
    };

    const displayImageUri = imageUri || (value ? getImageUrl(value) : null);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={handleImagePick}
                disabled={uploading}
            >
                {uploading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF6B35" />
                        <Text style={styles.uploadingText}>Đang upload...</Text>
                    </View>
                ) : displayImageUri ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: displayImageUri }} style={styles.imagePreview} resizeMode="cover" />
                        <View style={styles.changeImageOverlay}>
                            <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
                            <Text style={styles.changeImageText}>Thay đổi</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.placeholderContainer}>
                        <MaterialCommunityIcons name="image-plus" size={48} color="#999" />
                        <Text style={styles.placeholderText}>Chọn hoặc chụp ảnh</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    imagePickerButton: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    uploadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    imagePreviewContainer: {
        flex: 1,
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    changeImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    changeImageText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
    },
});
