import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    paddingVertical: 10,
  },
  linksContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 15,
  },
  link: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  forgotPasswordContainer: {
    paddingVertical: 10,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  createAccountButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  createAccountText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
