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

export default function CruiseScreen() {
  const router = useRouter();
  const [cruiseTicketNumber, setCruiseTicketNumber] = useState('');
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
    { 
      ticketNumber: 'RC-2024-001', 
      cruiseLine: 'Royal Caribbean', 
      shipName: 'Wonder of the Seas',
      route: 'Miami → Caribbean' 
    },
    { 
      ticketNumber: 'NCL-2024-456', 
      cruiseLine: 'Norwegian Cruise Line', 
      shipName: 'Norwegian Epic',
      route: 'Barcelona → Mediterranean' 
    },
    { 
      ticketNumber: 'CCL-2024-789', 
      cruiseLine: 'Carnival Cruise Line', 
      shipName: 'Carnival Panorama',
      route: 'Long Beach → Mexican Riviera' 
    },
    { 
      ticketNumber: 'MSC-2024-012', 
      cruiseLine: 'MSC Cruises', 
      shipName: 'MSC Seashore',
      route: 'Rome → Greek Isles' 
    },
  ];

  const handleCruiseSearch = () => {
    if (!cruiseTicketNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter a cruise ticket number');
      return;
    }

    // Basic validation for cruise ticket format
    const ticketRegex = /^[A-Z]{2,4}-\d{4}-\d{3}$/;
    if (!ticketRegex.test(cruiseTicketNumber.toUpperCase())) {
      Alert.alert(
        'Invalid Format', 
        'Please enter a valid cruise ticket number (e.g., RC-2024-001)'
      );
      return;
    }

    // Navigate to cruise details page
    router.push({
      pathname: '/cruise-details',
      params: {
        ticketNumber: cruiseTicketNumber.toUpperCase(),
        email: email || '',
        lastName: lastName || '',
      },
    });
  };

  const handleQuickSearch = (cruise: typeof quickSearchOptions[0]) => {
    router.push({
      pathname: '/cruise-details',
      params: {
        ticketNumber: cruise.ticketNumber,
        cruiseLine: cruise.cruiseLine,
        shipName: cruise.shipName,
        route: cruise.route,
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <Text style={styles.headerTitle}>Cruise Information</Text>
            <Text style={styles.headerSubtitle}>
              Access your cruise details and onboard services
            </Text>
          </View>
        </View>

        {/* Cruise Search */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="boat" size={20} color="#333333" />
            <Text style={styles.sectionTitle}>Find Your Cruise</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Enter your cruise ticket number or search by name</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="ticket" size={20} color="#333333" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Cruise ticket number (e.g., RC-2024-001)"
              value={cruiseTicketNumber}
              onChangeText={setCruiseTicketNumber}
              placeholderTextColor="#6b7a99"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#333333" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email (optional)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#6b7a99"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#333333" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Last name (optional)"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#6b7a99"
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleCruiseSearch}>
            <Text style={styles.searchButtonText}>Search Cruise</Text>
            <Ionicons name="search" size={20} color="#fdfaf6" />
          </TouchableOpacity>
        </View>

        {/* Quick Search Options */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="library" size={20} color="#333333" />
            <Text style={styles.sectionTitle}>Demo Cruises</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Popular cruise bookings for demonstration</Text>
          
          <View style={styles.quickSearchContainer}>
            {quickSearchOptions.map((cruise, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickSearchCard}
                onPress={() => handleQuickSearch(cruise)}
              >
                <View style={styles.quickSearchHeader}>
                  <Text style={styles.ticketNumber}>{cruise.ticketNumber}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#d4af37" />
                </View>
                <Text style={styles.cruiseLine}>{cruise.cruiseLine}</Text>
                <Text style={styles.shipName}>{cruise.shipName}</Text>
                <Text style={styles.route}>{cruise.route}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#333333" />
            <Text style={styles.sectionTitle}>What You'll Get</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="boat" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Cruise Overview</Text>
                <Text style={styles.featureText}>Ship details, itinerary, and sailing information</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="location" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Port Schedule</Text>
                <Text style={styles.featureText}>Real-time itinerary with port arrival times</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="bed" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Cabin Information</Text>
                <Text style={styles.featureText}>Deck location, amenities, and room details</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="restaurant" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Dining Options</Text>
                <Text style={styles.featureText}>Restaurants, bars, and specialty dining venues</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="storefront" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Onboard Shopping</Text>
                <Text style={styles.featureText}>Duty-free shops, boutiques, and gift stores</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="musical-notes" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Entertainment</Text>
                <Text style={styles.featureText}>Shows, activities, and daily entertainment schedule</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="map" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Live Ship Tracking</Text>
                <Text style={styles.featureText}>Current location, speed, and weather conditions</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f0f4f8' }]}>
                <Ionicons name="call" size={24} color="#333333" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Onboard Services</Text>
                <Text style={styles.featureText}>Housekeeping, room service, and guest services</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </Animated.View>
    </ScrollView>
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
    color: '#d4af37', // Professional Gold
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
    borderColor: '#d4af37', // Professional Gold
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
    borderColor: '#d4af37', // Professional Gold
  },
  quickSearchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a', // Rich Navy
  },
  cruiseLine: {
    fontSize: 14,
    color: '#333333', // Charcoal
    fontWeight: '600',
    marginBottom: 4,
  },
  shipName: {
    fontSize: 15,
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