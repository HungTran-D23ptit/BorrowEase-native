import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import type { Person } from '../types';

type Props = {
    people: Person[];
    onPress: () => void;
};

export function PeopleCard({ people, onPress }: Props) {
    const activeCount = people.filter(p => p.active).length;
    const total = Math.max(people.length, 1);
    const percent = Math.round((activeCount / total) * 100);

    return (
        <View style={styles.cardFull}>
            <Text style={styles.cardTitle}>Số người hoạt động (Hoạt động / tổng)</Text>
            <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
                <View style={{ marginTop: 8 }}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${percent}%` }]} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                        <Text style={styles.cardSub}>{activeCount}/{total}</Text>
                        <Text style={[styles.cardSub, { fontWeight: '700', color: '#111827' }]}>{percent}%</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

