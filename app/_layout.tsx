import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getAuthToken,
  getAuthTokenAdmin,
  initializeTokens,
} from "@/utils/localStorage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await initializeTokens();
      const userToken = getAuthToken();
      const adminToken = getAuthTokenAdmin();

      if (userToken) {
        setIsLoggedIn(true);
        setUserType("user");
      } else if (adminToken) {
        setIsLoggedIn(true);
        setUserType("admin");
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>

          {!isLoggedIn ? (
            <Stack.Screen name="auth" />
          ) : userType === "user" ? (
            <Stack.Screen name="user" />
          ) : (
            <Stack.Screen name="admin" />
          )}

        </Stack>

        <StatusBar style="auto" />
      </ToastProvider>
    </ThemeProvider>
  );
}
