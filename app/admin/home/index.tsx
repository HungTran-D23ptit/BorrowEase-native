import { useAdminLogin } from "@/hooks/admin/useAuth";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function AdminHome() {
  const router = useRouter();
  const { logout } = useAdminLogin();

  const handleLogout = async () => {
    logout();
    router.replace("/auth/LoginScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bảng điều khiển Admin</Text>
        <Text style={styles.subtitle}>Quản trị BorrowEase</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/admin/devices")}
        >
          <Text style={styles.cardTitle}>Quản lý thiết bị</Text>
          <Text style={styles.cardText}>
            Quản lý tất cả thiết bị và trạng thái
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quản lý người dùng</Text>
          <Text style={styles.cardText}>
            Quản lý tất cả người dùng và quyền hạn
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Báo cáo</Text>
          <Text style={styles.cardText}>Xem báo cáo và phân tích hệ thống</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cài đặt</Text>
          <Text style={styles.cardText}>Cấu hình cài đặt hệ thống</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nhật ký</Text>
          <Text style={styles.cardText}>Xem nhật ký hoạt động hệ thống</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
