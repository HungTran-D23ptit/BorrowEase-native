import { useState } from "react";
import * as adminAuthService from "../../services/admin/auth.service";
import { handleApiError } from "../../utils/errorHandler";
import { clearAuthTokenAdmin } from "../../utils/localStorage";

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await adminAuthService.adminLogin({
        email,
        password,
      });
      setSuccess(true);
      return response;
    } catch (err) {
      const message = handleApiError(err, "Đăng nhập admin thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout trên backend
      await adminAuthService.adminLogout();
    } catch (err) {
      // Vẫn xóa token local ngay cả khi API thất bại
      console.error("Logout API error:", err);
    } finally {
      // Luôn xóa token local và reset state
      clearAuthTokenAdmin();
      setSuccess(false);
      setError(null);
    }
  };

  return { login, logout, loading, error, success };
};

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");

  const forgotPassword = async (emailInput) => {
    setLoading(true);
    setError(null);
    try {
      await adminAuthService.adminForgotPassword(emailInput);
      setOtpSent(true);
      setEmail(emailInput);
    } catch (err) {
      const message = handleApiError(err, "Gửi OTP thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthService.adminVerifyOTP(email, otp);
      return response;
    } catch (err) {
      const message = handleApiError(err, "Xác minh OTP thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (otp, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthService.adminResetPassword(
        email,
        otp,
        newPassword
      );
      setOtpSent(false);
      return response;
    } catch (err) {
      const message = handleApiError(err, "Đặt lại mật khẩu thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    forgotPassword,
    verifyOTP,
    resetPassword,
    loading,
    error,
    otpSent,
    email,
  };
};
