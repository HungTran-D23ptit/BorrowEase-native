import { StyleSheet, Dimensions } from 'react-native';

const COLORS = {
  background: '#FFFFFF',
  textMain: '#111111',
  textSecondary: '#666666',
  primary: '#007AFF',
  inputBg: '#F5F5F5',
  categoryBg: '#F0F2F5',
};

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        paddingTop: 60,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        marginHorizontal: 20,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 12,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.textMain,
    },
    categoryContainer: {
        marginBottom: 20,
        paddingLeft: 20,
    },
    categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.categoryBg,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryItemSelected: {
        backgroundColor: COLORS.textMain,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    categoryTextSelected: {
        color: '#FFFFFF',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
});