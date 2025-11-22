import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// Màu chủ đạo
const ACTIVE_COLOR = '#007AFF';
const INACTIVE_COLOR = '#8E8E93';

export default function UserLayout() {
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
      {/* 1. TRANG CHỦ */}
      <Tabs.Screen
        // QUAN TRỌNG: Sửa name="home" thành "home/index"
        name="home/index"
        options={{
          title: 'Trang chủ', // Tên hiển thị trên Tab
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "home-variant" : "home-variant-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* 2. THIẾT BỊ */}
      <Tabs.Screen
        // QUAN TRỌNG: Sửa name="explore" thành "explore/index"
        name="explore/index"
        options={{
          title: 'Thiết bị',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* 3. LỊCH SỬ */}
      <Tabs.Screen
        // QUAN TRỌNG: Sửa name="history" thành "history/index"
        name="history/index"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "clock-time-eight" : "clock-time-eight-outline"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* 4. CÁ NHÂN */}
      <Tabs.Screen
        // QUAN TRỌNG: Sửa name="profile" thành "profile/index"
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
      <Tabs.Screen
        name="device/[id]" // Tên file dynamic route
        options={{
          href: null, // Quan trọng: null nghĩa là không hiện icon/nút
          headerShown: false, // Ẩn luôn header mặc định nếu muốn
        }}
      />
    </Tabs>
  );
}