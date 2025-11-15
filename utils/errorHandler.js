import { Alert } from "react-native";

export const handleApiError = (
  error,
  defaultMessage = "Đã có lỗi xảy ra!",
  showAlert = true
) => {
  let message = defaultMessage;

  console.error("[API Error]", error);

  try {
    if (
      error?.response?.data?.detail &&
      typeof error.response.data.detail === "object"
    ) {
      const detailMessages = Object.values(error.response.data.detail);
      message = detailMessages.join("\n");
      if (showAlert) {
        Alert.alert("Lỗi", message);
      }
      return message;
    }

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
      if (showAlert) {
        Alert.alert("Lỗi", message);
      }
      return message;
    }

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.response?.status) {
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

    if (showAlert) {
      Alert.alert("Lỗi", message);
    }
    return message;
  } catch (parseError) {
    console.error("[handleApiError] Parse error:", parseError);
    if (showAlert) {
      Alert.alert("Lỗi", defaultMessage);
    }
    return defaultMessage;
  }
};

export const showSuccessMessage = (message, title = "Thành công") => {
  Alert.alert(title, message);
};

export const showInfoMessage = (message, title = "Thông báo") => {
  Alert.alert(title, message);
};
