import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface Device {
  id: string;
  name: string;
  status: string;
  location: string;
}

export default function DeviceManagement() {
  const router = useRouter();
  const [devices, setDevices] = useState([
    { id: "1", name: "Thiết bị 1", status: "Hoạt động", location: "Phòng A" },
    {
      id: "2",
      name: "Thiết bị 2",
      status: "Không hoạt động",
      location: "Phòng B",
    },
    { id: "3", name: "Thiết bị 3", status: "Hoạt động", location: "Phòng C" },
  ]);

  const handleDevicePress = (device: Device) => {
    Alert.alert(
      "Chi tiết thiết bị",
      `Tên: ${device.name}\nTrạng thái: ${device.status}\nVị trí: ${device.location}`,
      [{ text: "OK" }]
    );
  };

  const handleAddDevice = () => {
    Alert.alert(
      "Thêm thiết bị",
      "Chức năng thêm thiết bị sẽ được triển khai sau."
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => handleDevicePress(item)}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceLocation}>{item.location}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "Hoạt động" ? styles.active : styles.inactive,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý thiết bị</Text>
        <TouchableOpacity onPress={handleAddDevice} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có thiết bị nào.</Text>
        }
      />
    </View>
  );
}
