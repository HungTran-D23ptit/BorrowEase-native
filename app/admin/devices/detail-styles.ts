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
        backgroundColor: APP_COLORS.background,
    },

    // Image Container
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#F5F5F5',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DDD',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: APP_COLORS.primary,
    },

    // Content Container
    contentContainer: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    deviceName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Quick Info
    quickInfoContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    quickInfoItem: {
        flex: 1,
        alignItems: 'center',
    },
    quickInfoLabel: {
        fontSize: 12,
        color: APP_COLORS.textSecondary,
        marginTop: 4,
        marginBottom: 4,
    },
    quickInfoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
    },
    quickInfoDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
    },

    // Sections
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
        lineHeight: 22,
        textAlign: 'justify',
    },

    // Specifications
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    specLabel: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
        flex: 1,
    },
    specValue: {
        fontSize: 14,
        fontWeight: '600',
        color: APP_COLORS.textMain,
        flex: 1,
        textAlign: 'right',
    },

    // History
    historyCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    historyUser: {
        fontSize: 15,
        fontWeight: '700',
        color: APP_COLORS.textMain,
    },
    historyStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    historyStatusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    historyDates: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    historyDate: {
        fontSize: 12,
        color: APP_COLORS.textSecondary,
    },

    // Bottom Actions
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        flexDirection: 'row',
        gap: 10,
    },
    editButton: {
        flex: 1,
        backgroundColor: APP_COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    editButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusButton: {
        width: 50,
        backgroundColor: APP_COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    deleteButton: {
        width: 50,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
});
