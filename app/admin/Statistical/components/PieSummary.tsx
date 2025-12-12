import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { styles } from '../styles';

const { width } = Dimensions.get('window');

type LegendDisplay = {
    key: string;
    label: string;
    color: string;
    percent: number;
    countText: string;
};

type Props = {
    pieData: { value: number; svg: { fill: string }; key: string; arc: { outerRadius: string; cornerRadius: number }; text: string }[];
    legendItems: LegendDisplay[];
    centerCount: number;
    centerTotal: number;
    centerLabel: string;
};

export function PieSummary({ pieData, legendItems, centerCount, centerTotal, centerLabel }: Props) {
    return (
        <View style={styles.cardFull}>
            <Text style={styles.cardTitle}>Thống kê mượn trả </Text>
            <View style={styles.centered}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 140, height: 140 }}>
                        <PieChart data={pieData} donut radius={70} innerRadius={40} />
                        <View style={styles.pieCenterTextWrap} pointerEvents="none">
                            <Text style={styles.pieCenterPercent}>{centerCount}/{centerTotal}</Text>
                            <Text style={styles.pieCenterSub}>{centerLabel}</Text>
                        </View>
                    </View>

                    <View style={{ marginLeft: 16, maxWidth: width - 80 }}>
                        {legendItems.map(item => (
                            <View key={item.key} style={styles.legendRow}>
                                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.legendLabel}>{item.label}</Text>
                                <Text style={styles.legendValue}>{item.countText}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

