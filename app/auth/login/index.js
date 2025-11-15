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
import { useAdminLogin } from "../../../hooks/admin/useAuth";
import {
  useGoogleLogin,
  useUserLogin,
  useUserRegister,
} from "../../../hooks/user/useAuth";
import {
  handleApiError,
  showSuccessMessage,
} from "../../../utils/errorHandler";
import { styles } from "./styles";

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("user");
  const [formType, setFormType] = useState("login"); // 'login' or 'register'

  const userLoginHook = useUserLogin();
  const adminLoginHook = useAdminLogin();
  const googleLoginHook = useGoogleLogin();
  const userRegisterHook = useUserRegister();

  const currentLoginHook =
    activeTab === "user" ? userLoginHook : adminLoginHook;

  const handleLogin = async (email, password) => {
    try {
      console.log("[LoginScreen] handleLogin called with:", {
        email,
        password,
      });
      const response = await currentLoginHook.login(email, password);
      if (response && response.data?.data?.access_token) {
        console.log("Login successful:", response);
        showSuccessMessage("Đăng nhập thành công!");
        if (activeTab === "user") {
          router.replace("/user");
        } else {
          router.replace("/admin");
        }
      }
    } catch (error) {
      handleApiError(error, "Đăng nhập thất bại");
    }
  };

  const handleRegister = async (data) => {
    try {
      if (activeTab === "admin") {
        handleApiError(
          {
            message:
              "Admin registration is not available. Contact your administrator.",
          },
          "",
          true
        );
        return;
      }
      console.log("Registering:", data);
      const response = await userRegisterHook.register(data);
      if (response) {
        showSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        setFormType("login");
      }
    } catch (error) {
      handleApiError(error, "Đăng ký thất bại");
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
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>BorrowEase</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
          </View>

          <View style={styles.content}>
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

            {activeTab === "user" && formType === "login" && (
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => setFormType("register")}
              >
                <Text style={styles.createAccountText}>Create Account</Text>
              </TouchableOpacity>
            )}

            {activeTab === "user" && formType === "register" && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setFormType("login")}
              >
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
