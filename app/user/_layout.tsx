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
          fontSize: 12, // Tăng nhẹ lại cỡ chữ vì chỉ còn 4 tab, nhìn sẽ thoáng hơn
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
      
      {/* 3. QUẢN LÝ (Đã đẩy lên vị trí thứ 3) */}
      <Tabs.Screen
        name="management/index"
        options={{
          title: 'Quản lý',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "tune" : "tune-variant"} 
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

      {/* --- CÁC MÀN HÌNH ẨN KHỎI TAB BAR (href: null) --- */}

      {/* Ẩn luôn tab History cũ nếu file vẫn còn trong thư mục */}
      <Tabs.Screen
        name="history/index"
        options={{
          href: null, 
          headerShown: false,
        }}
      />

      <Tabs.Screen name="device/[id]" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="borrow/[id]" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="management/detail/[id]" options={{ href: null, headerShown: false }} />
      
    </Tabs>
  );
}