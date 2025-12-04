import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './styles';

type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
};

const SAMPLE: Notification[] = [
    {
        id: '1',
        title: 'Nhắc đến hạn',
        message: 'Thiết bị [Tên thiết bị] sẽ đến hạn trả vào ngày [Ngày trả].',
        time: '5 phút trước',
        read: false,
    },
    {
        id: '2',
        title: 'Cảnh báo quá hạn',
        message: 'Thiết bị [Tên thiết bị] đã đến hạn trả vào ngày [Ngày trả].',
        time: '5 phút trước',
        read: false,
    },
    {
        id: '3',
        title: 'Yêu cầu được duyệt',
        message: 'Yêu cầu mượn thiết bị [Tên thiết bị] ([Số lượng] chiếc) đã được duyệt.',
        time: '5 phút trước',
        read: true,
    },
];

export default function NotificationsScreen() {
    const [items, setItems] = useState<Notification[]>(SAMPLE);

    const markRead = (id: string) => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, read: true } : i)));
    };

    const toggleRead = (id: string) => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, read: !i.read } : i)));
    };

    const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));

    const renderItem = ({ item }: { item: Notification }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => markRead(item.id)}
                onLongPress={() => toggleRead(item.id)}
                style={[styles.card, item.read && styles.cardRead]}
            >
                <View style={styles.leftCol}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>🔔</Text>
                    </View>
                </View>

                <View style={styles.middleCol}>
                    <Text style={[styles.title, item.read && styles.titleRead]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={[styles.message, item.read && styles.messageRead]} numberOfLines={2}>
                        {item.message}
                    </Text>
                </View>

                <View style={styles.rightCol}>
                    <Text style={[styles.timeText, item.read && styles.timeTextRead]}>{item.time}</Text>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
                    <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={i => i.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                ListEmptyComponent={<Text style={styles.empty}>Không có thông báo.</Text>}
            />
        </SafeAreaView>
    );
}
