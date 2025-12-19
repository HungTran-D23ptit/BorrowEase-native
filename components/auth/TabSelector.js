import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export const TabSelector = ({
  activeTab,
  onTabChange,
  tabs = ["user", "admin"],
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab === "user" ? "person" : "shield-checkmark"}
            size={20}
            color={activeTab === tab ? "#fff" : "#64748B"}
            style={styles.tabIcon}
          />
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab === "user" ? "Người dùng" : "Quản trị"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    marginHorizontal: 24,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#334155",
    shadowColor: "#334155",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
});
