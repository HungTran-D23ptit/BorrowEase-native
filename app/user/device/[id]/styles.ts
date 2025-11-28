import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // --- Image & Header ---
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
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD', marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#ccc'
  },

  // --- Content ---
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 25,
    textAlign: 'justify',
  },
  
  // --- Reviews ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 30, height: 30, borderRadius: 15, marginRight: 10, backgroundColor: '#DDD',
  },
  reviewerName: {
    fontWeight: 'bold', fontSize: 14,
  },
  reviewComment: {
    fontSize: 13, color: '#555', lineHeight: 18,
  },

  // --- Bottom Button ---
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  borrowButton: {
    backgroundColor: '#00D2FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  borrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});