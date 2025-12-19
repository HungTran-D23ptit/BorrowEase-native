import { StyleSheet } from 'react-native';

const COLORS = {
    background: '#F5F7FA',
    textMain: '#1F2937',
    textSecondary: '#6B7280',
    primary: '#334155',
    inputBg: '#FFFFFF',
    categoryBg: '#F3F4F6',
    border: '#E5E7EB',
};

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },

    // Gradient Header
    headerGradient: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 32,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '400',
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        marginHorizontal: 20,
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.textMain,
    },

    // Category filters
    categoryContainer: {
        marginBottom: 20,
        paddingLeft: 20,
    },
    categoryItem: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        backgroundColor: COLORS.categoryBg,
        borderRadius: 24,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryItemSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    categoryTextSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // Device grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
