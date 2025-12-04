import { StyleSheet } from 'react-native';

const APP_COLORS = {
    background: '#FFFFFF',
    textMain: '#111111',
    textSecondary: '#666666',
    primary: '#FF6B35',
    primaryLight: '#FFE5DC',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: '#F8F9FA',
    },

    // Header
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
    },

    // Profile Card
    profileCard: {
        backgroundColor: APP_COLORS.background,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EEE',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: APP_COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
        marginBottom: 8,
    },
    profileRole: {
        fontSize: 13,
        fontWeight: '600',
        color: APP_COLORS.primary,
        backgroundColor: APP_COLORS.primaryLight,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: APP_COLORS.background,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: APP_COLORS.textSecondary,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
    },

    // Menu Section
    menuSection: {
        backgroundColor: APP_COLORS.background,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    menuIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: APP_COLORS.textMain,
    },

    // Logout Button
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEBEE',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F44336',
        marginLeft: 8,
    },

    // Version
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    versionText: {
        fontSize: 12,
        color: APP_COLORS.textSecondary,
    },
});
