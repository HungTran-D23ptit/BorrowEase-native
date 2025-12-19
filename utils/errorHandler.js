// This file now exports functions that should be used with ToastContext
// Import and use like this:
// import { useToast } from '../contexts/ToastContext';
// const { showError, showSuccess, showInfo } = useToast();

export const parseApiError = (error, defaultMessage = "Đã có lỗi xảy ra!") => {
  let message = defaultMessage;

  console.error("[API Error]", error);

  try {
    // Handle detail object errors
    if (
      error?.response?.data?.detail &&
      typeof error.response.data.detail === "object"
    ) {
      const detailMessages = Object.values(error.response.data.detail);
      message = detailMessages.join("\n");
      return message;
    }

    // Handle errors array
    if (
      error?.response?.data?.errors &&
      Array.isArray(error.response.data.errors)
    ) {
      const errorMessages = error.response.data.errors.map((err) => {
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        return JSON.stringify(err);
      });
      message = errorMessages.join("\n");
      return message;
    }

    // Handle message field
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.response?.status) {
      // Status code messages
      const statusMessages = {
        400: "Dữ liệu không hợp lệ",
        401: "Bạn chưa đăng nhập hoặc token hết hạn",
        403: "Bạn không có quyền truy cập",
        404: "Không tìm thấy dữ liệu",
        409: "Dữ liệu đã tồn tại",
        422: "Dữ liệu không hợp lệ",
        500: "Lỗi server. Vui lòng thử lại sau",
        503: "Server đang bảo trì",
      };
      message = statusMessages[error.response.status] || defaultMessage;
    }

    return message;
  } catch (parseError) {
    console.error("[parseApiError] Parse error:", parseError);
    return defaultMessage;
  }
};

// Legacy support - these will be deprecated
// Use ToastContext instead
import { Alert } from "react-native";

export const handleApiError = (
  error,
  defaultMessage = "Đã có lỗi xảy ra!",
  showAlert = true
) => {
  const message = parseApiError(error, defaultMessage);

  if (showAlert) {
    Alert.alert("Lỗi", message);
  }

  return message;
};

export const showSuccessMessage = (message, title = "Thành công") => {
  Alert.alert(title, message);
};

export const showInfoMessage = (message, title = "Thông báo") => {
  Alert.alert(title, message);
};
