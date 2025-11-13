
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 16,
  },
  lead: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  featuresSection: {},
  boxInfo: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 12,
  },
  boxText: {
    marginTop: 8,
  },
  separator: {
      height: 1,
      width: '90%',
      alignSelf: 'center',
      marginVertical: 30,
      opacity: 0.2,
  },
  secondarySection: {},
  sectionTitle: {
      textAlign: 'center',
      marginBottom: 24,
      fontSize: 28,
  },
  // --- NAVBAR STYLES ---
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  navbarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  navbarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navbarButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});