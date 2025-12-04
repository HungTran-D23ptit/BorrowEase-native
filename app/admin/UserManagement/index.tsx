import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
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
}));

export default function UserManagement() {
    const [tab, setTab] = useState<'user' | 'admin'>('user');
    const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');


    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    function onToggleExpand(id: string) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    function onAdd() {
        setEditingUser(null);
        setModalVisible(true);
    }

    function onEdit(user: User) {
        setEditingUser(user);
        setModalVisible(true);
    }

    function onDelete(user: User) {
        Alert.alert('Xác nhận', `Bạn có chắc muốn xóa ${user.name}?`, [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: () => {
                    setUsers(prev => prev.filter(u => u.id !== user.id));
                },
            },
        ]);
    }

    function onSave(form: User) {
        if (editingUser) {
            setUsers(prev => prev.map(u => (u.id === form.id ? form : u)));
        } else {
            setUsers(prev => [{ ...form, id: String(prev.length + 1) }, ...prev]);
        }
        setModalVisible(false);
        setEditingUser(null);
    }

    const filtered = users.filter(u =>
        `${u.name} ${u.code} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <SafeAreaView style={s.container}>
            <Text style={s.header}>Danh sách người dùng</Text>

            <View style={s.searchRow}>
                <TextInput
                    placeholder="Tìm kiếm"
                    value={search}
                    onChangeText={setSearch}
                    style={s.searchInput}
                />
            </View>

            <View style={s.tabRow}>
                <TouchableOpacity
                    style={[s.tabBtn, tab === 'user' && s.tabActive]}
                    onPress={() => setTab('user')}>
                    <Text style={[s.tabText, tab === 'user' && s.tabTextActive]}>Người dùng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[s.tabBtn, tab === 'admin' && s.tabActive]}
                    onPress={() => setTab('admin')}>
                    <Text style={[s.tabText, tab === 'admin' && s.tabTextActive]}>Quản trị</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={i => i.id}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <View>
                                <Text style={s.name}>{item.name}</Text>
                                <Text style={s.code}>{item.code}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={s.actionBtn} onPress={() => onEdit(item)}>
                                    <Text style={s.actionText}>Sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[s.actionBtn, { marginLeft: 8 }]} onPress={() => onDelete(item)}>
                                    <Text style={[s.actionText, { color: '#DC2626' }]}>Xóa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={s.caretBtn} onPress={() => onToggleExpand(item.id)}>
                                    <Text style={s.caretText}>{expandedId === item.id ? '▲' : '▼'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {expandedId === item.id && (
                            <View style={s.cardBody}>
                                <Text style={s.label}>Số điện thoại: <Text style={s.value}>{item.phone}</Text></Text>
                                <Text style={s.label}>Email: <Text style={s.value}>{item.email}</Text></Text>
                                <Text style={s.label}>Địa chỉ: <Text style={s.value}>{item.address}</Text></Text>
                                <Text style={s.label}>Mật khẩu: <Text style={s.value}>{item.password}</Text></Text>
                                <Text style={s.label}>Trạng thái: <Text style={s.value}>{item.status}</Text></Text>
                                <Text style={s.label}>Trạng thái tài khoản: <Text style={s.value}>{item.accountStatus}</Text></Text>
                                {tab === 'admin' && <Text style={s.label}>Quyền: <Text style={s.value}>{item.role}</Text></Text>}
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
    }, [initialData, visible]);

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
        };
        onSave(payload);
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalContainer}>
                <View style={s.modalCard}>
                    <Text style={s.modalTitle}>{initialData ? 'Chỉnh sửa thông tin cá nhân' : 'Thêm người dùng'}</Text>
                    <ScrollView>
                        <TouchableOpacity style={s.avatarPlaceholder}>
                            <Text style={{ color: '#fff' }}>Thay đổi ảnh đại diện</Text>
                        </TouchableOpacity>

                        <Text style={s.fieldLabel}>Họ và tên</Text>
                        <TextInput value={name} onChangeText={setName} style={s.input} />

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

                        <Text style={s.fieldLabel}>Quyền</Text>
                        <View style={s.optionRow}>
                            <TouchableOpacity onPress={() => setRole('Edit')} style={[s.optionBtn, role === 'Edit' && s.optionActive]}>
                                <Text style={role === 'Edit' ? s.optionTextActive : s.optionText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRole('View')} style={[s.optionBtn, role === 'View' && s.optionActive]}>
                                <Text style={role === 'View' ? s.optionTextActive : s.optionText}>View</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 18 }} />

                        <View style={s.modalActionsRow}>
                            <TouchableOpacity style={[s.modalActionBtn, { backgroundColor: '#E5E7EB' }]} onPress={onClose}>
                                <Text>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.modalActionBtn, { backgroundColor: '#10B981' }]} onPress={handleSave}>
                                <Text style={{ color: '#fff' }}>Lưu</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
