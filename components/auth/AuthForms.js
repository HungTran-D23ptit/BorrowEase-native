import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export const LoginForm = ({ onLogin, loading, error, userType = "user" }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (errors.password) {
      const newErrors = { ...errors };
      delete newErrors.password;
      setErrors(newErrors);
    }
  };

  const handleLogin = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password.trim()) {
      newErrors.password = "Password không được bỏ trống";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="mail-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email của bạn"
          value={email}
          onChangeText={handleEmailChange}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{errors.email}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="rgba(255, 255, 255, 0.6)"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{errors.password}</Text>
        </View>
      )}

      {/* Forgot Password Link - Only for user login */}
      {userType === "user" && (
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>
              {userType === "user" ? "Đăng nhập" : "Đăng nhập Admin"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};


export const RegisterForm = ({ onRegister, loading, error }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleRegister = () => {
    const { name, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Tên không được bỏ trống";
    }
    if (!email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!password.trim()) {
      newErrors.password = "Password không được bỏ trống";
    } else if (password.length < 6) {
      newErrors.password = "Password phải có ít nhất 6 ký tự";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password không trùng khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegister(formData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="person-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Tên người dùng"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
        />
      </View>
      {errors.name && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{errors.name}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="mail-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email của bạn"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{errors.email}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Mật khẩu"
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry={!showPassword}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{errors.password}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          secureTextEntry={!showConfirmPassword}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Tạo tài khoản</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};


export const ForgotPasswordForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue.trim()) {
      setEmailError("Email không được bỏ trống");
      return false;
    }
    if (!emailRegex.test(emailValue)) {
      setEmailError("Email không hợp lệ");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      return;
    }
    onSubmit(email);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (value.trim()) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu?</Text>
      <Text style={styles.description}>
        Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="mail-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email của bạn"
          value={email}
          onChangeText={handleEmailChange}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {emailError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{emailError}</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Gửi mã OTP</Text>
            <Ionicons name="send" size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const OTPVerificationForm = ({ onSubmit, loading, error, email }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (!otp.trim() || !newPassword.trim()) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }
    onSubmit(otp, newPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực OTP</Text>
      <Text style={styles.description}>
        Chúng tôi đã gửi mã OTP đến {email}. Nhập mã và mật khẩu mới của bạn.
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="keypad-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã OTP (6 số)"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Ionicons
            name={showNewPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputIconWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          editable={!loading}
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1E293B",
  },
  description: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 28,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  error: {
    color: "#EF4444",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#334155",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    shadowColor: "#334155",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 8,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
});

