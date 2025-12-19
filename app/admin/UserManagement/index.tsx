import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { s } from './styles';

type Role = 'Edit' | 'View';

type User = {
    id: string;
    name: string;
    code: string;
    phone: string;
    email: string;
    address: string;
    password: string;
    status: 'Đang hoạt động' | 'Ngưng hoạt động';
    accountStatus: 'Mở tài khoản' | 'Khóa tài khoản';
    role: Role;
    avatar?: string | null;
};

const SAMPLE_USERS: User[] = Array.from({ length: 8 }).map((_, i) => ({
    id: String(i + 1),
    name: 'Hoahoang',
    code: 'B23DCCC069',
    phone: '032320291',
    email: 'abc@gmail.com',
    address: 'acb Hà Nội',
    password: 'âsdfgsggrrwr',
    status: i % 2 === 0 ? 'Đang hoạt động' : 'Ngưng hoạt động',
    accountStatus: i % 3 === 0 ? 'Khóa tài khoản' : 'Mở tài khoản',
    role: i % 2 === 0 ? 'Edit' : 'View',
    avatar: null,
}));

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    function onToggleExpand(id: string) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    function onToggleLock(user: any) {
        const isLocked = user.status === 'DE_ACTIVE';
        const action = isLocked ? 'mở khóa' : 'khóa';
        setConfirmModal({ visible: true, user, action });
    }

    async function handleConfirmToggleLock() {
        const { user, action } = confirmModal;
        if (!user) return;

        const isLocked = user.status === 'DE_ACTIVE';

        try {
            if (isLocked) {
                await activateUser(user._id);
                showSuccess(`Đã mở khóa tài khoản ${user.name} thành công`);
            } else {
                await deleteUser(user._id);
                showSuccess(`Đã khóa tài khoản ${user.name} thành công`);
            }
            setTimeout(() => {
                refresh();
            }, 500);
        } catch (error) {
            console.error('Toggle lock error:', error);
            showError(`Không thể ${action} tài khoản`);
        }
    }

    // ⭐ Lọc theo search + theo tab + theo role
    const filtered = users.filter(u => {
        const matchSearch =
            `${u.name} ${u.code} ${u.email}`.toLowerCase().includes(search.toLowerCase());

        if (!matchSearch) return false;

        if (tab === 'user') return u.role === 'View';
        if (tab === 'admin') return u.role === 'Edit';

        return true;
    });

    const activePercent = stats ? Math.round((stats.active / stats.total) * 100) : 0;

    return (
        <View style={s.container}>
            {/* HEADER WITH GRADIENT */}
            <LinearGradient
                colors={['#1E293B', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.headerGradient}
            >
                <Text style={s.headerTitle}>Quản lý người dùng</Text>
                <Text style={s.headerSubtitle}>
                    {stats?.total || 0} người dùng trong hệ thống
                </Text>
            </LinearGradient>

            {/* STATS CARDS */}
            <View style={s.statsContainer}>
                <View style={[s.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <View style={[s.statIconCircle, { backgroundColor: '#34C759' }]}>
                        <MaterialCommunityIcons name="account-check" size={24} color="#FFF" />
                    </View>
                    <Text style={s.statValue}>{stats?.active || 0}</Text>
                    <Text style={s.statLabel}>Hoạt động</Text>
                </View>

                <View style={[s.statCard, { backgroundColor: '#FFEBEE' }]}>
                    <View style={[s.statIconCircle, { backgroundColor: '#FF3B30' }]}>
                        <MaterialCommunityIcons name="account-off" size={24} color="#FFF" />
                    </View>
                    <Text style={s.statValue}>{stats?.deActive || 0}</Text>
                    <Text style={s.statLabel}>Bị khóa</Text>
                </View>

                <View style={[s.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <View style={[s.statIconCircle, { backgroundColor: '#007AFF' }]}>
                        <MaterialCommunityIcons name="account-group" size={24} color="#FFF" />
                    </View>
                    <Text style={s.statValue}>{activePercent}%</Text>
                    <Text style={s.statLabel}>Tỷ lệ hoạt động</Text>
                </View>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={i => i.id}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={
                                        item.avatar
                                            ? { uri: item.avatar }
                                            : require('./default-avatar.png')
                                    }
                                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                                />
                                <View>
                                    <Text style={s.name}>{item.name}</Text>
                                    <Text style={s.code}>{item.code}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={s.actionBtn} onPress={() => onEdit(item)}>
                                    <Text style={s.actionText}>Sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[s.actionBtn, { marginLeft: 8 }]}
                                    onPress={() => onDelete(item)}>
                                    <Text style={[s.actionText, { color: '#DC2626' }]}>Xóa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={s.caretBtn}
                                    onPress={() => onToggleExpand(item.id)}>
                                    <Text style={s.caretText}>
                                        {expandedId === item.id ? '▲' : '▼'}
                                    </Text>
                                </TouchableOpacity>

                        {expandedId === item.id && (
                            <View style={s.cardBody}>
                                <Text style={s.label}>Số điện thoại: <Text style={s.value}>{item.phone}</Text></Text>
                                <Text style={s.label}>Mã người dùng <Text style={s.value}>{item.phone}</Text></Text>
                                <Text style={s.label}>Email: <Text style={s.value}>{item.email}</Text></Text>
                                <Text style={s.label}>Địa chỉ: <Text style={s.value}>{item.address}</Text></Text>
                                <Text style={s.label}>Mật khẩu: <Text style={s.value}>{item.password}</Text></Text>
                                <Text style={s.label}>Trạng thái: <Text style={s.value}>{item.status}</Text></Text>
                                <Text style={s.label}>Trạng thái tài khoản: <Text style={s.value}>{item.accountStatus}</Text></Text>
                                {tab === 'admin' && (
                                    <Text style={s.label}>Quyền: <Text style={s.value}>{item.role}</Text></Text>
                                )}
                            </View>
                        )}
                    </View>
                )}
            />

            <TouchableOpacity style={s.addBtn} onPress={onAdd}>
                <Text style={s.addBtnText}>Thêm người dùng</Text>
            </TouchableOpacity>

            <UserFormModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingUser(null);
                }}
                onSave={onSave}
                initialData={editingUser ?? undefined}
            />
        </SafeAreaView>
    );
}


function UserFormModal({
    visible,
    onClose,
    onSave,
    initialData,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (u: User) => void;
    initialData?: User;
}) {
    const [name, setName] = useState(initialData?.name ?? '');
    const [code, setCode] = useState(initialData?.code ?? '');
    const [email, setEmail] = useState(initialData?.email ?? '');
    const [phone, setPhone] = useState(initialData?.phone ?? '');
    const [address, setAddress] = useState(initialData?.address ?? '');
    const [password, setPassword] = useState(initialData?.password ?? '');
    const [status, setStatus] = useState<User['status']>(initialData?.status ?? 'Đang hoạt động');
    const [accountStatus, setAccountStatus] = useState<User['accountStatus']>(initialData?.accountStatus ?? 'Mở tài khoản');
    const [role, setRole] = useState<Role>(initialData?.role ?? 'View');
    const [avatar, setAvatar] = useState<string | null>(initialData?.avatar ?? null);

    React.useEffect(() => {
        setName(initialData?.name ?? '');
        setCode(initialData?.code ?? '');
        setEmail(initialData?.email ?? '');
        setPhone(initialData?.phone ?? '');
        setAddress(initialData?.address ?? '');
        setPassword(initialData?.password ?? '');
        setStatus(initialData?.status ?? 'Đang hoạt động');
        setAccountStatus(initialData?.accountStatus ?? 'Mở tài khoản');
        setRole(initialData?.role ?? 'View');
        setAvatar(initialData?.avatar ?? null);
    }, [initialData, visible]);

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Lỗi', 'Ứng dụng cần quyền truy cập ảnh');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    }

    function handleSave() {
        if (!name.trim() || !email.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập ít nhất tên và email');
            return;
        }

        const payload: User = {
            id: initialData?.id ?? String(Math.floor(Math.random() * 1000000)),
            name,
            code: code || 'B23D...',
            email,
            phone,
            address,
            password,
            status,
            accountStatus,
            role,
            avatar,
        };

        onSave(payload);
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={s.modalContainer}
            >
                <View style={s.modalCard}>
                    <Text style={s.modalTitle}>
                        {initialData ? 'Chỉnh sửa thông tin cá nhân' : 'Thêm người dùng'}
                    </Text>

                    <ScrollView>
                        {/* Avatar */}
                        <TouchableOpacity style={s.avatarPlaceholder} onPress={pickImage}>
                            {avatar ? (
                                <Image
                                    source={{ uri: avatar }}
                                    style={{ width: 80, height: 80, borderRadius: 40 }}
                                />
                            ) : (
                                <Text style={{ color: '#fff' }}>Thay đổi ảnh đại diện</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={s.fieldLabel}>Họ và tên</Text>
                        <TextInput value={name} onChangeText={setName} style={s.input} />
                        <Text style={s.fieldLabel}>Mã người dùng</Text>
                        <TextInput value={code} onChangeText={setCode} style={s.input} />

                        <Text style={s.fieldLabel}>Email</Text>
                        <TextInput value={email} onChangeText={setEmail} style={s.input} keyboardType="email-address" />

                        <Text style={s.fieldLabel}>Số điện thoại</Text>
                        <TextInput value={phone} onChangeText={setPhone} style={s.input} keyboardType="phone-pad" />

                        <Text style={s.fieldLabel}>Địa chỉ</Text>
                        <TextInput value={address} onChangeText={setAddress} style={s.input} />

                        <Text style={s.fieldLabel}>Mật khẩu</Text>
                        <TextInput value={password} onChangeText={setPassword} style={s.input} secureTextEntry />

                        <Text style={s.fieldLabel}>Trạng thái</Text>
                        <View style={s.optionRow}>
                            <TouchableOpacity onPress={() => setStatus('Đang hoạt động')} style={[s.optionBtn, status === 'Đang hoạt động' && s.optionActive]}>
                                <Text style={status === 'Đang hoạt động' ? s.optionTextActive : s.optionText}>Đang hoạt động</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStatus('Ngưng hoạt động')} style={[s.optionBtn, status === 'Ngưng hoạt động' && s.optionActive]}>
                                <Text style={status === 'Ngưng hoạt động' ? s.optionTextActive : s.optionText}>Ngưng hoạt động</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={s.fieldLabel}>Trạng thái tài khoản</Text>
                        <View style={s.optionRow}>
                            <TouchableOpacity onPress={() => setAccountStatus('Mở tài khoản')} style={[s.optionBtn, accountStatus === 'Mở tài khoản' && s.optionActive]}>
                                <Text style={accountStatus === 'Mở tài khoản' ? s.optionTextActive : s.optionText}>Mở tài khoản</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setAccountStatus('Khóa tài khoản')} style={[s.optionBtn, accountStatus === 'Khóa tài khoản' && s.optionActive]}>
                                <Text style={accountStatus === 'Khóa tài khoản' ? s.optionTextActive : s.optionText}>Khóa tài khoản</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={s.modalActions}>
                            <TouchableOpacity
                                style={s.modalCancelButton}
                                onPress={() => setConfirmModal({ visible: false, user: null, action: '' })}
                                disabled={actionLoading}
                            >
                                <Text style={s.modalCancelText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    s.modalConfirmButton,
                                    {
                                        backgroundColor:
                                            confirmModal.action === 'khóa' ? '#FF3B30' : '#34C759',
                                    },
                                ]}
                                onPress={async () => {
                                    await handleConfirmToggleLock();
                                    setConfirmModal({ visible: false, user: null, action: '' });
                                }}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={s.modalConfirmText}>Xác nhận</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
