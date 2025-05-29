import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FlightsScreen() {
  const router = useRouter();
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  const quickSearchOptions = [
    { flightNumber: 'AA123', airline: 'American Airlines', route: 'JFK → LAX' },
    { flightNumber: 'UA456', airline: 'United Airlines', route: 'LAX → ORD' },
    { flightNumber: 'DL789', airline: 'Delta Airlines', route: 'ATL → JFK' },
    { flightNumber: 'SW012', airline: 'Southwest Airlines', route: 'LAS → PHX' },
  ];

  const handleFlightSearch = () => {
    if (!flightNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter a flight number');
      return;
    }

    // Navigate to flight details page
    router.push({
      pathname: '/flight-details',
      params: {
        flightNumber: flightNumber.toUpperCase(),
        airline: airline || 'Unknown Airline',
        departureDate: departureDate || new Date().toISOString(),
      },
    });
  };

  const handleQuickSearch = (flight: typeof quickSearchOptions[0]) => {
    router.push({
      pathname: '/flight-details',
      params: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureDate: new Date().toISOString(),
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flight Information</Text>
        <Text style={styles.headerSubtitle}>Track your flight and get airport details</Text>
      </View>

      {/* Flight Search */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Flight</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="airplane" size={20} color="#0ea5e9" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter flight number (e.g., AA123, UA456)"
            value={flightNumber}
            onChangeText={setFlightNumber}
            placeholderTextColor="#64748b"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="business" size={20} color="#0ea5e9" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Airline (optional)"
            value={airline}
            onChangeText={setAirline}
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="calendar" size={20} color="#0ea5e9" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Departure date (optional)"
            value={departureDate}
            onChangeText={setDepartureDate}
            placeholderTextColor="#64748b"
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleFlightSearch}>
          <Text style={styles.searchButtonText}>Get Flight Details</Text>
          <Ionicons name="search" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Quick Search Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Search</Text>
        <Text style={styles.sectionSubtitle}>Popular flights for demonstration</Text>
        
        <View style={styles.quickSearchContainer}>
          {quickSearchOptions.map((flight, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickSearchCard}
              onPress={() => handleQuickSearch(flight)}
            >
              <View style={styles.quickSearchHeader}>
                <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
              <Text style={styles.airline}>{flight.airline}</Text>
              <Text style={styles.route}>{flight.route}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You'll Get</Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="time" size={24} color="#0ea5e9" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Updates</Text>
              <Text style={styles.featureText}>Live flight status, delays, and gate changes</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="map" size={24} color="#0ea5e9" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Airport Maps</Text>
              <Text style={styles.featureText}>Interactive maps with amenities and services</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="bag" size={24} color="#0ea5e9" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Baggage Info</Text>
              <Text style={styles.featureText}>Weight limits, dimensions, and restrictions</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="restaurant" size={24} color="#0ea5e9" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Airport Amenities</Text>
              <Text style={styles.featureText}>Restaurants, shops, lounges, and services</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '400',
    opacity: 0.9,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  quickSearchContainer: {
    gap: 12,
  },
  quickSearchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#1e293b',
  },
  airline: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
    marginBottom: 4,
  },
  route: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
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
    color: '#1e293b',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 30,
  },
}); 