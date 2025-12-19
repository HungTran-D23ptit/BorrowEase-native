import { useCallback, useState } from 'react';

/**
 * Custom hook để quản lý notification modal
 * Thay thế cho Alert.alert() với UI đẹp hơn
 */
export const useNotificationModal = () => {
    const [modalState, setModalState] = useState({
        visible: false,
        type: 'info', // 'error' | 'warning' | 'info' | 'success'
        title: '',
        message: '',
    });

    const showModal = useCallback((type, message, title = '') => {
        setModalState({
            visible: true,
            type,
            title,
            message,
        });
    }, []);

    const showError = useCallback((message, title = 'Lỗi') => {
        showModal('error', message, title);
    }, [showModal]);

    const showWarning = useCallback((message, title = 'Cảnh báo') => {
        showModal('warning', message, title);
    }, [showModal]);

    const showInfo = useCallback((message, title = 'Thông báo') => {
        showModal('info', message, title);
    }, [showModal]);

    const showSuccess = useCallback((message, title = 'Thành công') => {
        showModal('success', message, title);
    }, [showModal]);

    const hideModal = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            visible: false,
        }));
    }, []);

    return {
        modalState,
        showError,
        showWarning,
        showInfo,
        showSuccess,
        hideModal,
    };
};
