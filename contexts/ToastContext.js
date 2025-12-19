import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Toast from '../components/Toast';
import { setToastHandler } from '../services/ToastService';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success',
    });

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        setToast({
            visible: true,
            message,
            type,
            duration,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, visible: false }));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message, duration) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    // Register with ToastService for global access
    useEffect(() => {
        setToastHandler({
            showToast,
            showSuccess,
            showError,
            showWarning,
            showInfo,
            hideToast,
        });
    }, [showToast, showSuccess, showError, showWarning, showInfo, hideToast]);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                showSuccess,
                showError,
                showWarning,
                showInfo,
                hideToast,
            }}
        >
            {children}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
};
