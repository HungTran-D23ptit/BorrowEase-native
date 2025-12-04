import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

// Màu chủ đạo cho Admin (khác với User để phân biệt)
const ACTIVE_COLOR = '#FF6B35'; // Cam đậm cho admin
const INACTIVE_COLOR = '#8E8E93';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 80,
          paddingBottom: 25,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 0,
        },
      }}
    >
      {/* 1. TRANG CHỦ ADMIN */}
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />

      {/* 2. QUẢN LÝ THIẾT BỊ */}
      <Tabs.Screen
        name="devices/index"
        options={{
          title: 'Thiết bị',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "devices" : "devices"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 3. CÁ NHÂN */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Ẩn các màn hình không cần hiển thị trong tab */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false
        }}
      />

      {/* Ẩn trang chi tiết thiết bị */}
      <Tabs.Screen
        name="devices/[id]"
        options={{
          href: null,
          headerShown: false
        }}
      />
    </Tabs>
  );
}
