import { StyleSheet } from 'react-native';

// 1. Export màu sắc để dùng được ở cả file index lẫn file styles
export const APP_COLORS = {
  background: '#FFFFFF',
  textMain: '#111111',
  textSecondary: '#666666',
  bellBg: '#FFEBF0',
  deadlineBlue: '#E3F2FD', 
  deadlinePink: '#FCE4EC', 
};

// 2. Export styles object
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, 
        backgroundColor: APP_COLORS.background,
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    welcomeSection: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: '#EEE', marginRight: 12, overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },
    greetingText: { fontSize: 14, color: APP_COLORS.textSecondary, marginBottom: 2 },
    userName: { fontSize: 18, fontWeight: '800', color: APP_COLORS.textMain },
    notificationButton: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: APP_COLORS.bellBg, justifyContent: 'center', alignItems: 'center',
    },

    // Section Styles
    section: { paddingHorizontal: 20, marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: APP_COLORS.textMain, marginBottom: 15 },

    // Deadline Styles
    deadlineContainer: { paddingLeft: 5 },
    deadlineItem: { flexDirection: 'row', marginBottom: 12 },
    timelineWrapper: { width: 24, alignItems: 'center', marginRight: 12 },
    timelineDot: {
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: '#C4C4C4', borderWidth: 2, borderColor: '#FFF',
    },
    timelineLine: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginVertical: 4 },
    deadlineContent: {
        flex: 1, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
    },
    deadlineDays: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4 },
    deadlineDevice: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    
    seeMoreButton: { alignSelf: 'center', marginTop: 5 },
    seeMoreText: { fontSize: 14, fontWeight: '700', textDecorationLine: 'underline', color: '#000' },

    // Category & Device Grid Styles
    categoryBlock: { marginBottom: 20 },
    categoryTitle: { fontSize: 16, fontWeight: '700', color: APP_COLORS.textMain, marginBottom: 10 },
    
    // Style cho hàng thiết bị
    deviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
    }
});