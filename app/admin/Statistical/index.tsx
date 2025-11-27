import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { styles } from './styles';

const {width} = Dimensions.get('window');

type Slice = {
  key: string;
  value: number;
  svg: {fill: string};
  label: string;
};

const COLORS = {
  overdue: '#FF6B6B', 
  pending: '#FFC857', 
  borrowing: '#4D96FF', 
  cancelled: '#B0BEC5',
  returned: '#7BE495', 
  neutral: '#E0E0E0',
};

export default function StatisticsScreen() {
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');

  const deviceTypes = ['Tất cả', 'Camera Recorder', 'Camera', 'Microphone'];
  const statuses = ['Tất cả', 'Đã huỷ', 'Chờ duyệt', 'Đã trả', 'Đang mượn'];

  const dataSlices: Slice[] = useMemo(() => {
    const overdue = 10;
    const pending = 8;
    const borrowing = 30;
    const cancelled = 4;
    const returned = 68;

    return [
      {key: 'overdue', value: overdue, svg: {fill: COLORS.overdue}, label: 'Quá hạn'},
      {key: 'pending', value: pending, svg: {fill: COLORS.pending}, label: 'Chờ duyệt'},
      {key: 'borrowing', value: borrowing, svg: {fill: COLORS.borrowing}, label: 'Đang mượn'},
      {key: 'cancelled', value: cancelled, svg: {fill: COLORS.cancelled}, label: 'Đã huỷ'},
      {key: 'returned', value: returned, svg: {fill: COLORS.returned}, label: 'Đã trả'},
    ];
  }, []);

  const total = dataSlices.reduce((s, a) => s + a.value, 0) || 1;

  const pieData = dataSlices.map((slice, index) => ({
    value: slice.value,
    svg: slice.svg,
    key: `pie-${slice.key}-${index}`,
    arc: {outerRadius: '100%', cornerRadius: 6},
  }));

  const legendItems = dataSlices;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      <Text style={styles.title}>Thống kê mượn trả</Text>

      <View style={styles.cardRow}>
        <View style={styles.cardLarge}>
          <Text style={styles.cardTitle}>Trạng thái thiết bị (Bảo trì / tổng)</Text>
          <View style={styles.centered}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 140, height: 140}}>
                <PieChart data={pieData} donut  radius={70}  innerRadius={40} />

                <View style={styles.pieCenterTextWrap} pointerEvents="none">
                  <Text style={styles.pieCenterPercent}>25%</Text>
                  <Text style={styles.pieCenterSub}>Bảo trì</Text>
                </View>
              </View>

              <View style={{marginLeft: 16}}>
                {legendItems.map(item => (
                  <View key={item.key} style={styles.legendRow}>
                    <View style={[styles.legendColor, {backgroundColor: item.svg.fill}]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>{Math.round((item.value / total) * 100)}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardSmall}>
          <Text style={styles.cardTitle}>Số người hoạt động</Text>
          <Text style={styles.bigPercent}>88%</Text>
          <Text style={styles.cardSub}>Hoạt động / tổng</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <FlatList
          data={deviceTypes}
          horizontal
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedDeviceType === item && styles.chipActive,
              ]}
              onPress={() => setSelectedDeviceType(item)}>
              <Text style={[styles.chipText, selectedDeviceType === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.filterRowSmall}>
        <FlatList
          data={statuses}
          horizontal
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.chipSmall,
                selectedStatus === item && styles.chipSmallActive,
              ]}
              onPress={() => setSelectedStatus(item)}>
              <Text style={[styles.chipSmallText, selectedStatus === item && styles.chipSmallTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.listCard}>
        <Text style={styles.sectionTitle}>Thống kê số liệu thiết bị được mượn</Text>

        {['Camera Recorder', 'Camera', 'Microphone'].map((t) => (
          <View key={t} style={styles.itemRow}>
            <View>
              <Text style={styles.itemTitle}>{t}</Text>
              <Text style={styles.itemSubtitle}>Tổng mượn: {Math.floor(Math.random() * 60) + 5}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.itemPercent}>{Math.floor(Math.random() * 100)}%</Text>
              <Text style={styles.itemSmall}>so với tổng</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.listCard}>
        <Text style={styles.sectionTitle}>Gần đây</Text>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.recentRow}>
            <View style={{flex: 1}}>
              <Text style={styles.recentTitle}>Camera Recorder</Text>
              <Text style={styles.recentSub}>Người mượn: Nguyễn A - Trạng thái: Đang mượn</Text>
            </View>
            <View style={{width: 100, alignItems: 'flex-end'}}>
              <Text style={styles.recentTime}>09:41</Text>
              <Text style={styles.recentStatus}>Đang mượn</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
