import { useState } from "react";
import * as userAuthService from "../../services/user/auth.service";
import { handleApiError } from "../../utils/errorHandler";
import { clearAuthToken } from "../../utils/localStorage";

export const useUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      console.log("[useUserLogin] Calling userLogin with:", {
        email,
        password,
      });
      const response = await userAuthService.userLogin({ email, password });
      setSuccess(true);
      return response;
    } catch (err) {
      const message = handleApiError(err, "Đăng nhập thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setSuccess(false);
    setError(null);
  };

  return { login, logout, loading, error, success };
};

export const useUserRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userAuthService.userRegister(data);
      setSuccess(true);
      return response;
    } catch (err) {
      const message = handleApiError(err, "Đăng ký thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const loginWithGoogle = async (googleToken) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userAuthService.userLoginWithGoogle({
        token: googleToken,
      });
      setSuccess(true);
      return response;
    } catch (err) {
      const message = handleApiError(err, "Đăng nhập Google thất bại", false);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error, success };
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
      await userAuthService.userForgotPassword(emailInput);
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
      const response = await userAuthService.userVerifyOTP(email, otp);
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
      const response = await userAuthService.userResetPassword(
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
