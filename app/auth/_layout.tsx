import { Stack } from "expo-router";
import { ToastProvider } from "../../contexts/ToastContext";

export default function AuthLayout() {
  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" />
      </Stack>
    </ToastProvider>
  );
}
