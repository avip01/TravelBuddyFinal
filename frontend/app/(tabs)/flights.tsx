import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FlightScreen() {
  const router = useRouter();
  const [flightNumber, setFlightNumber] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const quickSearchOptions = [
    { flightNumber: 'AA123', airline: 'American Airlines', route: 'JFK → LAX' },
    { flightNumber: 'UA456', airline: 'United Airlines', route: 'SFO → ORD' },
    { flightNumber: 'DL789', airline: 'Delta Air Lines', route: 'ATL → LHR' },
    { flightNumber: 'SW012', airline: 'Southwest Airlines', route: 'BWI → LAX' },
  ];

  const validateFlightNumber = (number: string) => {
    const flightRegex = /^[A-Z]{2,3}\d{3,4}$/;
    return flightRegex.test(number.toUpperCase());
  };

  const handleFlightSearch = () => {
    if (!flightNumber.trim()) {
      Alert.alert('Required Field', 'Please enter a flight number');
      return;
    }

    if (!validateFlightNumber(flightNumber)) {
      Alert.alert('Invalid Format', 'Flight number format: AA123 or XYZ1234');
      return;
    }

    router.push({
      pathname: '/flight-details',
      params: {
        flightNumber: flightNumber.toUpperCase(),
        airline: 'Demo Airline',
      },
    });
  };

  const handleQuickSearch = (flight: typeof quickSearchOptions[0]) => {
    router.push({
      pathname: '/flight-details',
      params: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
      },
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <Text style={styles.headerTitle}>Flight Tracker</Text>
            <Text style={styles.headerSubtitle}>Track your flight status and get real-time updates</Text>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="airplane" size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Find Your Flight</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Enter your flight number or search by details</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="airplane" size={20} color="#1e3a8a" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Flight number (e.g., AA123, UA456)"
              value={flightNumber}
              onChangeText={setFlightNumber}
              placeholderTextColor="#e5c07b"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#1e3a8a" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email (optional)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#e5c07b"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#1e3a8a" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Last name (optional)"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#e5c07b"
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleFlightSearch}>
            <Text style={styles.searchButtonText}>Track Flight</Text>
            <Ionicons name="search" size={20} color="#fdfaf6" />
          </TouchableOpacity>
        </View>

        {/* Quick Search Options */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="library" size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Demo Flights</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Popular flight routes for demonstration</Text>
          
          <View style={styles.quickSearchContainer}>
            {quickSearchOptions.map((flight, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickSearchCard}
                onPress={() => handleQuickSearch(flight)}
              >
                <View style={styles.quickSearchHeader}>
                  <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#e5c07b" />
                </View>
                <Text style={styles.airline}>{flight.airline}</Text>
                <Text style={styles.route}>{flight.route}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>What You'll Get</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f5f3e7' }]}>
                <Ionicons name="airplane" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-time Status</Text>
                <Text style={styles.featureText}>Live updates on departure, arrival, and gate changes</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="location" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Airport Information</Text>
                <Text style={styles.featureText}>Terminal details, gates, and airport amenities</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f5f3e7' }]}>
                <Ionicons name="bag" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Baggage Information</Text>
                <Text style={styles.featureText}>Carry-on and checked baggage policies</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="map" size={24} color="#1e3a8a" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Interactive Maps</Text>
                <Text style={styles.featureText}>Navigate airports with detailed terminal maps</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6', // Ivory
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerGradient: {
    backgroundColor: '#333333', // Charcoal
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1e3a8a', // Rich Navy
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fdfaf6', // Ivory
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e5c07b', // Champagne Gold
    fontWeight: '400',
    opacity: 0.9,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333', // Charcoal
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333', // Charcoal
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#1e3a8a', // Rich Navy
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 8,
  },
  searchButtonText: {
    color: '#fdfaf6', // Ivory
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  quickSearchContainer: {
    gap: 12,
  },
  quickSearchCard: {
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 12,
    padding: 16,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  quickSearchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flightNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a', // Rich Navy
  },
  airline: {
    fontSize: 14,
    color: '#333333', // Charcoal
    fontWeight: '600',
    marginBottom: 4,
  },
  route: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 12,
    padding: 16,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333', // Charcoal
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 30,
  },
}); 