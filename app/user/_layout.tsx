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
          height: 80, // Chiều cao 80 để thoáng
          paddingBottom: 25, // Đẩy icon lên trên thanh Home ảo
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
        name="home/index"
        options={{
          title: 'Trang chủ', 
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
      
      {/* 5. ẨN NÚT CHI TIẾT THIẾT BỊ */}
      <Tabs.Screen
        // CẬP NHẬT QUAN TRỌNG: Thêm "/index" vào cuối vì bạn đã đổi thành thư mục
        name="device/[id]/index" 
        options={{
          href: null, // Quan trọng: null nghĩa là không hiện icon/nút
          headerShown: false, 
        }}
      />
    </Tabs>
  );
}