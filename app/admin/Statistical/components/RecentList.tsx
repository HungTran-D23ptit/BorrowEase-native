import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

const RECENT = [1, 2, 3];

export function RecentList() {
    return (
        <View style={styles.listCard}>
            <Text style={styles.sectionTitle}>Gần đây</Text>
            {RECENT.map(i => (
                <View key={i} style={styles.recentRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.recentTitle}>Camera Recorder</Text>
                        <Text style={styles.recentSub}>Người mượn: Nguyễn A - Trạng thái: Đang mượn</Text>
                    </View>
                    <View style={{ width: 100, alignItems: 'flex-end' }}>
                        <Text style={styles.recentTime}>09:41</Text>
                        <Text style={styles.recentStatus}>Đang mượn</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

