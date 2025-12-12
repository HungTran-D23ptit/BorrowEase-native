import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import type { Device } from '../types';

type Props = {
    deviceTypes: string[];
    statuses: string[];
    selectedDeviceType: string;
    selectedStatus: string;
    onSelectDeviceType: (value: string) => void;
    onSelectStatus: (value: string) => void;
    filteredDevices: Device[];
    statusSummary: { key: string; label: string; color: string; countText: string; percent: number }[];
    currentSummary: { label: string; count: number; total: number };
};

export function DeviceFiltersList({
    deviceTypes,
    statuses,
    selectedDeviceType,
    selectedStatus,
    onSelectDeviceType,
    onSelectStatus,
    filteredDevices,
    statusSummary,
    currentSummary,
}: Props) {
    return (
        <View style={styles.listCard}>

            <View style={{ marginBottom: 8 }}>
                <FlatList
                    data={deviceTypes}
                    horizontal
                    keyExtractor={i => i}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.chip,
                                selectedDeviceType === item && styles.chipActive,
                            ]}
                            onPress={() => onSelectDeviceType(item)}>
                            <Text style={[styles.chipText, selectedDeviceType === item && styles.chipTextActive]}>{item}</Text>

                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={{ marginBottom: 12 }}>
                <FlatList
                    data={statuses}
                    horizontal
                    keyExtractor={i => i}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.chipSmall,
                                selectedStatus === item && styles.chipSmallActive,
                            ]}
                            onPress={() => onSelectStatus(item)}>
                            <Text style={[styles.chipSmallText, selectedStatus === item && styles.chipSmallTextActive]}>{item}</Text>
                        </TouchableOpacity>
                        
                    )}
                />
            </View>

            <View>
                {filteredDevices.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                        <Image source={require('../../../../assets/images/react-logo.png')} style={{ width: 96, height: 96, opacity: 0.4, marginBottom: 12 }} />
                        <Text style={{ color: '#6B7280' }}>Danh sách trống</Text>
                    </View>
                ) : (
                    <>
                            <View style={{ marginBottom: 8 }}>
                                <Text style={{ color: '#6B7280' }}>{currentSummary.label}: {currentSummary.count} / {currentSummary.total}</Text>
                            </View>

                            <FlatList
                                data={filteredDevices}
                                keyExtractor={i => i.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.itemRow}>
                                        {selectedStatus === 'Bảo trì' ? (
                                            <>
                                                <Text style={styles.itemTitle}>Ngày: {item.time}</Text>
                                                <Text style={styles.itemSubtitle}>Số lượng: 1</Text>
                                            </>
                                        ) : (
                                            <>
                                                <View>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>{item.name}</Text>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemSubtitle}>Người mượn: {item.borrower}</Text>
                                                </View>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <Text style={styles.recentTime}>{item.time}</Text>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.recentStatus, item.status === 'Đã huỷ' ? { color: '#FF6B6B' } : {}]}>{item.status}</Text>
                                                </View>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />}
                            />
                        </>
                    )}
            </View>
        </View>
    );
}

