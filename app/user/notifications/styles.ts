import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 32,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    markAllBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    markAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardRead: {
        backgroundColor: '#F9FAFB',
        borderColor: '#F3F4F6',
    },
    leftCol: {
        marginRight: 14,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 22,
    },
    middleCol: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 5,
    },
    titleRead: {
        color: '#6B7280',
        fontWeight: '600',
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    messageRead: {
        color: '#9CA3AF',
    },
    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingVertical: 2,
        marginLeft: 8,
    },
    timeText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 6,
        fontWeight: '500',
    },
    timeTextRead: {
        color: '#D1D5DB',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#334155',
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
