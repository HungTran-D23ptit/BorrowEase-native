import React from 'react';
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import type { Person } from '../types';

type Props = {
    visible: boolean;
    filter: string;
    onChangeFilter: (value: string) => void;
    people: Person[];
    onClose: () => void;
    onOpenPerson?: (person: Person) => void;
};

const TABS = ['Hoạt động', 'Không hoạt động'];

export function PeopleModal({ visible, filter, onChangeFilter, people, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Danh sách người</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.modalClose}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalTabs}>
                        {TABS.map(tab => (
                            <TouchableOpacity key={tab} style={[styles.tabBtn, filter === tab && styles.tabBtnActive]} onPress={() => onChangeFilter(tab)}>
                                <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.modalList}>
                        {people.length === 0 ? (
                            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                                <Image source={require('../../../../assets/images/react-logo.png')} style={{ width: 72, height: 72, opacity: 0.35, marginBottom: 8 }} />
                                <Text style={{ color: '#6B7280' }}>Không có người phù hợp</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={people}
                                keyExtractor={i => i.id}
                                renderItem={({ item }) => (
                                    <View style={styles.modalRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemTitle}>{item.name}</Text>
                                            <Text style={styles.itemSubtitle}>ID: {item.id}</Text>
                                            <Text style={styles.itemSubtitle}>SĐT: {item.phone || 'N/A'}</Text>
                                        </View>
                                        <Text style={[styles.recentStatus, { color: item.active ? '#10B981' : '#9CA3AF' }]}>{item.active ? 'Hoạt động' : 'Không'}</Text>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

