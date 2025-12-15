import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ToastProvider } from '../../contexts/ToastContext';

const ACTIVE_COLOR = '#334155';
const INACTIVE_COLOR = '#8E8E93';

export default function AdminLayout() {
  return (
    <ToastProvider>
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

        {/* 3. QUẢN LÝ MƯỢN TRẢ */}
        <Tabs.Screen
          name="borrowing/index"
          options={{
            title: 'Mượn trả',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "swap-horizontal-circle" : "swap-horizontal-circle-outline"}
                size={28}
                color={color}
              />
            ),
          }}
        />

        {/* 4. THỐNG KÊ */}
        <Tabs.Screen
          name="Statistical/index"
          options={{
            title: 'Thống kê',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />

        {/* 5. QUẢN LÝ NGƯỜI DÙNG */}
        <Tabs.Screen
          name="UserManagement/index"
          options={{
            title: 'Người dùng',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />

        {/* 6. CÁ NHÂN */}
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

        {/* Ẩn trang thông báo - đã có chuông thông báo ở header */}
        <Tabs.Screen
          name="notifications/index"
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
    </ToastProvider>
  );
}
