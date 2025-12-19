// Toast Service - Can be called from anywhere (hooks, utils, etc.)
// This is a singleton service that communicates with ToastContext

let toastHandler = null;

export const setToastHandler = (handler) => {
    toastHandler = handler;
};

export const showToast = (message, type = 'success', duration) => {
    if (toastHandler) {
        toastHandler.showToast(message, type, duration);
    } else {
        console.warn('[ToastService] Toast handler not initialized');
    }
};

export const showSuccess = (message, duration) => {
    showToast(message, 'success', duration);
};

export const showError = (message, duration) => {
    showToast(message, 'error', duration);
};

export const showWarning = (message, duration) => {
    showToast(message, 'warning', duration);
};

export const showInfo = (message, duration) => {
    showToast(message, 'info', duration);
};

export const hideToast = () => {
    if (toastHandler) {
        toastHandler.hideToast();
    }
};
