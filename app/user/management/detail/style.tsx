import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    
    // --- Image Header ---
    imageContainer: {
        width: '100%', height: 300, backgroundColor: '#F5F5F5',
        position: 'relative', justifyContent: 'center', alignItems: 'center',
    },
    mainImage: { width: '70%', height: '70%', resizeMode: 'contain' },
    backButton: {
        position: 'absolute', top: 50, left: 20, zIndex: 10,
        width: 40, height: 40, justifyContent: 'center', borderRadius: 20,
    },
    dotsContainer: { position: 'absolute', bottom: 15, flexDirection: 'row' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD', marginHorizontal: 4 },
    activeDot: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#ccc' },

    // --- Content ---
    contentContainer: { padding: 20 },
    statusContainer: { marginBottom: 10 },
    statusText: { fontSize: 14, fontWeight: 'bold', fontStyle: 'italic' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20 },
    infoItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start', flexWrap: 'wrap' },
    labelText: { fontSize: 15, color: '#000', fontWeight: '400', lineHeight: 22 },
    valueText: { fontSize: 15, color: '#000', fontWeight: '400', lineHeight: 22, flex: 1 },
    reasonBlock: { marginTop: 5 },
    reasonText: { fontSize: 15, color: '#000', lineHeight: 22, textAlign: 'justify', marginTop: 2 },

    // --- Button Styles ---
    bottomContainer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', padding: 20,
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
    },
    actionButton: {
        height: 50,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    actionButtonText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#FFF' 
    },

    // --- Modal Styles ---
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },
    modalContent: {
        width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
    modalInput: {
        borderWidth: 1, borderColor: '#DDD', borderRadius: 10,
        padding: 10, height: 80, marginBottom: 20, fontSize: 14,
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    modalBtnCancel: {
        flex: 1, padding: 12, borderRadius: 10,
        backgroundColor: '#F5F5F5', marginRight: 10, alignItems: 'center',
    },
    modalBtnConfirm: {
        flex: 1, padding: 12, borderRadius: 10,
        backgroundColor: '#FF3B30', alignItems: 'center',
    },
    modalBtnTextCancel: { fontWeight: '600', color: '#333' },
    modalBtnTextConfirm: { fontWeight: '600', color: '#FFF' },
});