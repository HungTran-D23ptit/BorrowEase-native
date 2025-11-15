import { useUserLogin } from "@/hooks/user/useAuth";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function UserHome() {
  const router = useRouter();
  const { logout } = useUserLogin();

  const handleLogout = async () => {
    logout();
    router.replace("/auth/LoginScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trang chủ Người dùng</Text>
        <Text style={styles.subtitle}>Chào mừng đến với BorrowEase</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mượn</Text>
          <Text style={styles.cardText}>Xem yêu cầu mượn của bạn</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cho mượn</Text>
          <Text style={styles.cardText}>Quản lý các đề nghị cho mượn</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lịch sử</Text>
          <Text style={styles.cardText}>Xem lịch sử giao dịch</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hồ sơ</Text>
          <Text style={styles.cardText}>Quản lý hồ sơ của bạn</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
