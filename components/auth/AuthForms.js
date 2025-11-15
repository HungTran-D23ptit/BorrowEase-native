import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export const LoginForm = ({ onLogin, loading, error, userType = "user" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

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

    console.log("[LoginForm] Sending:", { email, password });
    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Enter your email"
        value={email}
        onChangeText={handleEmailChange}
        editable={!loading}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Enter password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        editable={!loading}
        placeholderTextColor="#999"
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Login as {userType === "user" ? "User" : "Admin"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


export const RegisterForm = ({ onRegister, loading, error }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

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
    const { username, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username không được bỏ trống";
    }
    if (!email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!password.trim()) {
      newErrors.password = "Password không được bỏ trống";
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
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={[styles.input, errors.username && styles.inputError]}
        placeholder="Choose a username"
        value={formData.username}
        onChangeText={(value) => handleChange("username", value)}
        editable={!loading}
        placeholderTextColor="#999"
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
        editable={!loading}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Create a password"
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        editable={!loading}
        placeholderTextColor="#999"
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleChange("confirmPassword", value)}
        secureTextEntry
        editable={!loading}
        placeholderTextColor="#999"
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword}</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
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
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>
        Enter your email address and we&apos;ll send you an OTP to reset your
        password.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Enter your email"
        value={email}
        onChangeText={handleEmailChange}
        editable={!loading}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />

      {emailError && <Text style={styles.error}>{emailError}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const OTPVerificationForm = ({ onSubmit, loading, error, email }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.description}>
        We sent an OTP to {email}. Enter it below along with your new password.
      </Text>

      <Text style={styles.label}>OTP Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        editable={!loading}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
        placeholderTextColor="#999"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#e74c3c",
    backgroundColor: "#ffe6e6",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 10,
  },
});
