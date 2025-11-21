import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  markAllText: { color: '#2563EB', fontWeight: '600' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
  },
  cardRead: {
    backgroundColor: '#F1F5F9', // gray background for read
  },

  leftCol: { width: 48, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FEF3F2', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 18 },

  middleCol: { flex: 1, paddingHorizontal: 8 },
  title: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  titleRead: { color: '#6B7280' },
  message: { marginTop: 4, fontSize: 13, color: '#475569' },
  messageRead: { color: '#94A3B8' },

  rightCol: { width: 70, alignItems: 'flex-end', justifyContent: 'space-between', height: 40 },
  timeText: { fontSize: 12, color: '#64748B' },
  timeTextRead: { color: '#94A3B8' },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#0EA5E9', 
    marginTop: 6,
  },

  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 24 },
});