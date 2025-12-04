import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
    },
    markAllBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },
    markAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardRead: {
        backgroundColor: '#F9FAFB',
        opacity: 0.7,
    },
    leftCol: {
        marginRight: 12,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
    middleCol: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    titleRead: {
        color: '#9CA3AF',
    },
    message: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    messageRead: {
        color: '#D1D5DB',
    },
    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    timeText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    timeTextRead: {
        color: '#D1D5DB',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
    },
    empty: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 40,
    },
});
