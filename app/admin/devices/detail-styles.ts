import { StyleSheet } from 'react-native';

const APP_COLORS = {
    background: '#FFFFFF',
    textMain: '#111111',
    textSecondary: '#666666',
    primary: '#334155',
    primaryLight: '#FFE5DC',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.background,
    },

    // Loading & Error States
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_COLORS.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: APP_COLORS.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_COLORS.background,
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: APP_COLORS.textMain,
        textAlign: 'center',
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
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
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
    backButtonText: {
        marginTop: 8,
        fontSize: 14,
        color: APP_COLORS.primary,
        fontWeight: '600',
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
        marginBottom: 2,
    },
    deviceCode: {
        fontSize: 13,
        color: APP_COLORS.textSecondary,
        fontWeight: '500',
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

    // Reviews
    reviewCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
    },
    reviewUserDetails: {
        marginLeft: 10,
        flex: 1,
    },
    reviewUserName: {
        fontSize: 15,
        fontWeight: '700',
        color: APP_COLORS.textMain,
    },
    reviewDate: {
        fontSize: 12,
        color: APP_COLORS.textSecondary,
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewComment: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
        lineHeight: 20,
        marginTop: 8,
    },
    emptyReviews: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
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
        backgroundColor: '#FFF3E0',
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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: APP_COLORS.textMain,
    },
    modalBody: {
        padding: 20,
        maxHeight: 500,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },

    // Form Styles
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: APP_COLORS.textMain,
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: APP_COLORS.textMain,
        backgroundColor: '#FFF',
    },
    formInputDisabled: {
        backgroundColor: '#F5F5F5',
        color: APP_COLORS.textSecondary,
    },
    formTextArea: {
        height: 100,
        textAlignVertical: 'top',
    },

    // Type Selector
    typeSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    typeOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    typeOptionActive: {
        backgroundColor: APP_COLORS.primary,
        borderColor: APP_COLORS.primary,
    },
    typeOptionText: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
        fontWeight: '500',
    },
    typeOptionTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },

    // Status Selector
    statusSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    statusOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    statusOptionActive: {
        backgroundColor: APP_COLORS.primary,
        borderColor: APP_COLORS.primary,
    },
    statusOptionText: {
        fontSize: 14,
        color: APP_COLORS.textSecondary,
        fontWeight: '500',
    },
    statusOptionTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },

    // Modal Buttons
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonCancel: {
        backgroundColor: '#F5F5F5',
    },
    modalButtonSubmit: {
        backgroundColor: APP_COLORS.primary,
    },
    modalButtonTextCancel: {
        fontSize: 16,
        fontWeight: '600',
        color: APP_COLORS.textSecondary,
    },
    modalButtonTextSubmit: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
