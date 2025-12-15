import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoginForm, RegisterForm } from "../../../components/auth/AuthForms";
import {
  Divider,
  GoogleLoginButton,
} from "../../../components/auth/SocialLogin";
import { TabSelector } from "../../../components/auth/TabSelector";
import { useToast } from "../../../contexts/ToastContext";
import { useAdminLogin } from "../../../hooks/admin/useAuth";
import {
  useGoogleLogin,
  useUserLogin,
  useUserRegister,
} from "../../../hooks/user/useAuth";
import { parseApiError } from "../../../utils/errorHandler";
import { styles } from "./styles";

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("user");
  const [formType, setFormType] = useState("login");
  const { showSuccess, showError } = useToast();

  const userLoginHook = useUserLogin();
  const adminLoginHook = useAdminLogin();
  const googleLoginHook = useGoogleLogin();
  const userRegisterHook = useUserRegister();

  const currentLoginHook =
    activeTab === "user" ? userLoginHook : adminLoginHook;

  const handleLogin = async (email, password) => {
    try {
      const response = await currentLoginHook.login(email, password);

      // Check if login was successful
      // API returns: { data: { access_token, expire_in, auth_type } }
      const token = response?.data?.access_token || response?.data?.data?.access_token;

      if (response && token) {
        showSuccess("Đăng nhập thành công!");

        // Use setTimeout to ensure toast shows before navigation
        setTimeout(() => {
          if (activeTab === "user") {
            router.replace("/user");
          } else {
            router.replace("/admin");
          }
        }, 100);
      } else {
        showError("Đăng nhập thất bại: Không nhận được token");
      }
    } catch (error) {
      const errorMessage = parseApiError(error, "Đăng nhập thất bại");
      showError(errorMessage);
    }
  };

  const handleRegister = async (data) => {
    try {
      if (activeTab === "admin") {
        showError("Không thể đăng ký tài khoản admin. Vui lòng liên hệ quản trị viên.");
        return;
      }
      const response = await userRegisterHook.register(data);
      if (response) {
        showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        setFormType("login");
      }
    } catch (error) {
      const errorMessage = parseApiError(error, "Đăng ký thất bại");
      showError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Google login for:", activeTab);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Half - Gradient Background */}
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topSection}
      >
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BE</Text>
        </View>

        <Text style={styles.title}>BorrowEase</Text>
        <Text style={styles.subtitle}>
          {formType === "login"
            ? "Chào mừng trở lại"
            : "Tạo tài khoản mới"}
        </Text>
      </LinearGradient>

      {/* Bottom Half - White Section with Form */}
      <View style={styles.bottomSection}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.formCard}>
                <TabSelector
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setFormType("login"); // Reset to login when switching tabs
                  }}
                  tabs={["user", "admin"]}
                />

                {activeTab === "user" && formType === "register" ? (
                  <RegisterForm
                    onRegister={handleRegister}
                    loading={userRegisterHook.loading}
                    error={userRegisterHook.error}
                  />
                ) : (
                  <LoginForm
                    onLogin={handleLogin}
                    loading={currentLoginHook.loading}
                    error={currentLoginHook.error}
                    userType={activeTab}
                  />
                )}

                {activeTab === "user" && formType === "login" && (
                  <>
                    <Divider />
                    <GoogleLoginButton
                      onPress={handleGoogleLogin}
                      loading={googleLoginHook.loading}
                    />
                  </>
                )}
              </View>

              {activeTab === "user" && formType === "login" && (
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={() => setFormType("register")}
                >
                  <Text style={styles.createAccountText}>Tạo tài khoản mới</Text>
                </TouchableOpacity>
              )}

              {activeTab === "user" && formType === "register" && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setFormType("login")}
                >
                  <Text style={styles.backButtonText}>← Quay lại đăng nhập</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
