import React, { useMemo, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { apiAdminAxios } from '../../../services/rootApi';
import { DeviceFiltersList } from './components/DeviceFiltersList';
import { PeopleCard } from './components/PeopleCard';
import { PeopleModal } from './components/PeopleModal';
import { PieSummary } from './components/PieSummary';
import { RecentList } from './components/RecentList';
import { styles } from './styles';
import type { Device, Person, PieSlice } from './types';

const STATUS_COLORS: Record<string, string> = {
    'Quá hạn': '#FF6B6B',
    'Chờ duyệt': '#FFC857',
    'Đang mượn': '#4D96FF',
    'Đã huỷ': '#B0BEC5',
    'Đã trả': '#7BE495',
    'Bảo trì': '#A78BFA',
};

export default function StatisticsScreen() {
    const [selectedDeviceType, setSelectedDeviceType] = useState<string>('Tất cả');
    const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');

    // People modal (open when tapping 'Số người hoạt động')
    const [peopleModalVisible, setPeopleModalVisible] = useState(false);
    const [peopleFilter, setPeopleFilter] = useState<string>('Hoạt động');
    const mockPeople = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: `p-${i}`,
        name: `Người dùng #${i + 1}`,
        phone: `0900${(100000 + i).toString().slice(-6)}`,
        active: i % 3 !== 0,
    })), []);
    const [users, setUsers] = useState<Person[]>([]);
    const openPeopleModal = () => setPeopleModalVisible(true);

    const deviceTypes = ['Tất cả', 'Camera Recorder', 'Camera', 'Microphone'];
    const statuses = ['Tất cả', 'Đã huỷ', 'Chờ duyệt', 'Đã trả', 'Đang mượn', 'Bảo trì', 'Quá hạn'];

    // Mock devices data for list display (replace with real API call)
    const mockDevices: Device[] = useMemo(() => {
        const types = ['Camera Recorder', 'Camera', 'Microphone'];
        const sts = ['Đã huỷ', 'Chờ duyệt', 'Đã trả', 'Đang mượn', 'Bảo trì', 'Quá hạn'];
        const list = Array.from({ length: 30 }).map((_, i) => ({
            id: `dev-${i}`,
            name: `${types[i % types.length]} #${100 + i}`,
            type: types[i % types.length],
            status: sts[i % sts.length],
            borrower: ['Nguyễn A', 'Trần B', 'Lê C'][i % 3],
            time: `${9 + (i % 12)}:${(i % 60).toString().padStart(2, '0')}`,
            active: i % 2 === 0,
        }));
        return list;
    }, []);
    const [apiDevices, setApiDevices] = useState<Device[]>([]);
    // fetch users and devices from admin API if available
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // try a couple of plausible endpoints
                const usersRes = await apiAdminAxios.get('/admin/users').catch(() => apiAdminAxios.get('/users').catch(() => null));
                if (usersRes && usersRes.data) {
                    const data = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
                    if (mounted) setUsers(data.map((u:any) => ({
                        id: u.id || u._id || u.email,
                        name: u.name || u.fullName || u.email,
                        phone: u.phone || u.phoneNumber || '',
                        active: u.isActive ?? true,
                    })));
                }

                const devRes = await apiAdminAxios.get('/admin/devices').catch(() => apiAdminAxios.get('/devices').catch(() => null));
                if (devRes && devRes.data) {
                    const d = Array.isArray(devRes.data) ? devRes.data : devRes.data.devices || [];
                    if (mounted) setApiDevices(d.map((x:any,i:number) => ({ id: x.id || x._id || `dev-${i}`, name: x.name || x.deviceName || `Device ${i}`, type: x.type || x.category || 'Camera', status: x.status || x.state || 'Đang mượn', borrower: x.borrower?.name || x.user || 'Chưa', time: x.updatedAt || x.createdAt || 'N/A', active: x.active ?? true })));
                }
            } catch (e) {
                // ignore, fallback to mock
            }
        })();
        return () => { mounted = false; };
    }, []);

    const peopleData = users.length ? users : mockPeople;
    const devicesList = apiDevices.length ? apiDevices : mockDevices;
    const people = peopleData;
    const devices = devicesList;

    const filteredMainDevices = devices.filter(d => (selectedDeviceType === 'Tất cả' || d.type === selectedDeviceType) && (selectedStatus === 'Tất cả' || d.status === selectedStatus));

    // Pie chart uses all devices; colors locked per status
    const dataSlices: PieSlice[] = useMemo(() => {
        const all = apiDevices.length ? apiDevices : mockDevices;
        const labels = ['Quá hạn', 'Chờ duyệt', 'Đang mượn', 'Đã huỷ', 'Đã trả', 'Bảo trì'];
        return labels.map(label => ({
            key: label,
            value: all.filter(d => d.status === label).length,
            svg: { fill: STATUS_COLORS[label] || '#D1D5DB' },
            label,
        }));
    }, [apiDevices, mockDevices]);

    const typeScopedDevices = selectedDeviceType === 'Tất cả' ? devices : devices.filter(d => d.type === selectedDeviceType);
    const typeTotal = Math.max(typeScopedDevices.length, 1);

    // Legend for pie (global view)
    const allDevices = apiDevices.length ? apiDevices : mockDevices;
    const allTotal = allDevices.length || 1;
    const legendItems = dataSlices.map(slice => {
        const count = allDevices.filter(d => d.status === slice.label).length;
        const percent = Math.round((count / allTotal) * 100);
        return {
            key: slice.key,
            label: slice.label,
            color: slice.svg.fill,
            percent,
            countText: `${count}/${allTotal}`,
            value: count,
        };
    });
    const pieData = legendItems.map((item, index) => ({
        value: item.value,
        svg: { fill: item.color },
        key: `pie-${item.key}-${index}`,
        arc: { outerRadius: '100%', cornerRadius: 6 },
        text: `${item.percent}%`,
    }));

    const currentStatusCount = selectedStatus === 'Tất cả'
        ? typeTotal
        : typeScopedDevices.filter(d => d.status === selectedStatus).length;
    const centerCount = allTotal;
    const centerTotal = allTotal;
    const centerLabel = 'Tất cả';

    const filteredPeople = people.filter(p => (peopleFilter === 'Hoạt động' ? p.active : !p.active));

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Thống kê</Text>

            <PieSummary
                pieData={pieData}
                legendItems={legendItems}
                centerCount={centerCount}
                centerTotal={centerTotal}
                centerLabel={centerLabel}
            />

            <DeviceFiltersList
                deviceTypes={deviceTypes}
                statuses={statuses}
                selectedDeviceType={selectedDeviceType}
                selectedStatus={selectedStatus}
                onSelectDeviceType={setSelectedDeviceType}
                onSelectStatus={setSelectedStatus}
                filteredDevices={filteredMainDevices}
                statusSummary={legendItems.map(item => {
                    const count = typeScopedDevices.filter(d => d.status === item.label).length;
                    return {
                        ...item,
                        countText: `${count}/${typeTotal}`,
                    };
                })}
                currentSummary={{ label: selectedStatus, count: currentStatusCount, total: typeTotal }}
            />

            <PeopleCard people={people} onPress={openPeopleModal} />

           

            <PeopleModal
                visible={peopleModalVisible}
                filter={peopleFilter}
                onChangeFilter={setPeopleFilter}
                people={filteredPeople}
                onClose={() => setPeopleModalVisible(false)}
            />

            <RecentList />
        </ScrollView>
    );
}
