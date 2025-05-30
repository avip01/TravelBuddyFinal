import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

interface FlightData {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  gate: string;
  terminal: string;
  status: string;
  departureCity: string;
  arrivalCity: string;
  aircraft: string;
  duration: string;
}

interface BaggageInfo {
  carryon: {
    dimensions: string;
    weight: string;
  };
  checked: {
    dimensions: string;
    weight: string;
    fee: string;
  };
}

interface AirportAmenity {
  icon: string;
  name: string;
  description: string;
  location: string;
}

export default function FlightDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState('all');

  // Mock flight data - in real app, this would come from API
  const flightData: FlightData = {
    flightNumber: (params.flightNumber as string) || 'XY123',
    airline: (params.airline as string) || 'Example Air',
    departureAirport: 'JFK',
    arrivalAirport: 'LAX',
    departureTime: '8:20 AM',
    arrivalTime: '11:15 AM',
    gate: 'C1',
    terminal: 'Terminal 4',
    status: 'On Time',
    departureCity: 'New York',
    arrivalCity: 'Los Angeles',
    aircraft: 'Boeing 737-800',
    duration: '5h 55m',
  };

  const baggageInfo: BaggageInfo = {
    carryon: {
      dimensions: '55 x 40 x 25 cm',
      weight: '10 kg',
    },
    checked: {
      dimensions: '158 cm total',
      weight: '23 kg',
      fee: '$30',
    },
  };

  const airportAmenities: AirportAmenity[] = [
    { icon: 'restaurant', name: 'Restaurants', description: '24/7 dining options', location: 'Terminals 1-8' },
    { icon: 'storefront', name: 'Shops', description: 'Duty-free & retail', location: 'All terminals' },
    { icon: 'bed', name: 'Sleep Areas', description: 'Quiet rest zones', location: 'Terminal 4' },
    { icon: 'wifi', name: 'Free WiFi', description: 'High-speed internet', location: 'Airport-wide' },
    { icon: 'car', name: 'Car Rental', description: 'Multiple providers', location: 'Ground level' },
    { icon: 'medical', name: 'Medical Center', description: '24/7 healthcare', location: 'Terminal 4' },
    { icon: 'accessibility', name: 'Accessibility', description: 'Full ADA compliance', location: 'All areas' },
    { icon: 'diamond', name: 'VIP Lounges', description: 'Premium comfort', location: 'Terminals 1,4,7' },
  ];

  // Mock airport coordinates
  const airportCoordinates = {
    latitude: 40.6413,
    longitude: -73.7781,
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...airportCoordinates,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'on time':
          return '#10b981';
        case 'delayed':
          return '#f59e0b';
        case 'cancelled':
          return '#ef4444';
        default:
          return '#6b7280';
      }
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fdfaf6" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{flightData.airline}</Text>
          <Text style={styles.headerSubtitle}>Flight {flightData.flightNumber}</Text>
        </View>
        <StatusBadge status={flightData.status} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Flight Route Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <View style={styles.airportInfo}>
              <Text style={styles.airportCode}>{flightData.departureAirport}</Text>
              <Text style={styles.cityName}>{flightData.departureCity}</Text>
              <Text style={styles.timeText}>{flightData.departureTime}</Text>
            </View>
            
            <View style={styles.flightPath}>
              <View style={styles.flightLine} />
              <Ionicons 
                name="airplane" 
                size={20} 
                color="#1e3a8a" 
                style={styles.planeIcon} 
              />
              <View style={styles.flightLine} />
            </View>
            
            <View style={styles.airportInfo}>
              <Text style={styles.airportCode}>{flightData.arrivalAirport}</Text>
              <Text style={styles.cityName}>{flightData.arrivalCity}</Text>
              <Text style={styles.timeText}>{flightData.arrivalTime}</Text>
            </View>
          </View>
          
          <View style={styles.flightDetails}>
            <Text style={styles.duration}>Duration: {flightData.duration}</Text>
            <Text style={styles.aircraft}>{flightData.aircraft}</Text>
          </View>
        </View>

        {/* Boarding Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boarding Information</Text>
          <View style={styles.boardingCard}>
            <View style={styles.boardingRow}>
              <View style={styles.boardingItem}>
                <Ionicons name="airplane" size={24} color="#1e3a8a" />
                <Text style={styles.boardingLabel}>Gate</Text>
                <Text style={styles.boardingValue}>A12</Text>
              </View>
              <View style={styles.boardingItem}>
                <Ionicons name="people" size={24} color="#1e3a8a" />
                <Text style={styles.boardingLabel}>Seat</Text>
                <Text style={styles.boardingValue}>14F</Text>
              </View>
              <View style={styles.boardingItem}>
                <Ionicons name="person" size={24} color="#1e3a8a" />
                <Text style={styles.boardingLabel}>Group</Text>
                <Text style={styles.boardingValue}>B</Text>
              </View>
            </View>
            
            <View style={styles.boardingRow}>
              <View style={styles.boardingItem}>
                <Ionicons name="time" size={24} color="#1e3a8a" />
                <Text style={styles.boardingLabel}>Boarding</Text>
                <Text style={styles.boardingValue}>10:45 AM</Text>
              </View>
              <View style={styles.boardingItem}>
                <Ionicons name="card" size={24} color="#1e3a8a" />
                <Text style={styles.boardingLabel}>Terminal</Text>
                <Text style={styles.boardingValue}>3</Text>
              </View>
              <View style={styles.boardingItem}>
                <Ionicons name="checkmark-circle" size={24} color="#1e3a8a" />
                <Text style={styles.boardingLabel}>Status</Text>
                <Text style={styles.boardingValue}>On Time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Baggage Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baggage Information</Text>
          <View style={styles.baggageContainer}>
            <View style={styles.baggageCard}>
              <View style={styles.baggageHeader}>
                <Ionicons name="bag-handle" size={24} color="#1e3a8a" />
                <Text style={styles.baggageTitle}>Carry-On</Text>
              </View>
              <Text style={styles.baggageText}>Max: 22" x 14" x 9"</Text>
              <Text style={styles.baggageText}>Weight: Up to 15 lbs</Text>
              <Text style={styles.baggageFee}>Included</Text>
            </View>
            
            <View style={styles.baggageCard}>
              <View style={styles.baggageHeader}>
                <Ionicons name="bag" size={24} color="#1e3a8a" />
                <Text style={styles.baggageTitle}>Checked Bag</Text>
              </View>
              <Text style={styles.baggageText}>Max: 28" x 18" x 10"</Text>
              <Text style={styles.baggageText}>Weight: Up to 50 lbs</Text>
              <Text style={styles.baggageFee}>$35 each way</Text>
            </View>
          </View>
        </View>

        {/* Airport Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>John F. Kennedy International Airport</Text>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                ...airportCoordinates,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Marker
                coordinate={airportCoordinates}
                title="JFK Airport"
                description="John F. Kennedy International Airport"
              />
            </MapView>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapTitle}>JFK Airport</Text>
              <Text style={styles.mapSubtitle}>Queens, New York</Text>
            </View>
          </View>
        </View>

        {/* Airport Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Airport Amenities</Text>
          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Ionicons name="wifi" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.amenityName}>WiFi</Text>
              <Text style={styles.amenityDescription}>Complimentary internet access</Text>
              <Text style={styles.amenityLocation}>Available throughout flight</Text>
            </View>
            
            <View style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Ionicons name="restaurant" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.amenityName}>Dining</Text>
              <Text style={styles.amenityDescription}>In-flight meal service</Text>
              <Text style={styles.amenityLocation}>Galley - Row 15</Text>
            </View>
            
            <View style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Ionicons name="tv" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.amenityName}>Entertainment</Text>
              <Text style={styles.amenityDescription}>Seatback screens & streaming</Text>
              <Text style={styles.amenityLocation}>Every seat</Text>
            </View>
            
            <View style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Ionicons name="battery-charging" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.amenityName}>Power</Text>
              <Text style={styles.amenityDescription}>USB & AC power outlets</Text>
              <Text style={styles.amenityLocation}>Every row</Text>
            </View>
            
            <View style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Ionicons name="storefront" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.amenityName}>Duty Free</Text>
              <Text style={styles.amenityDescription}>Onboard shopping service</Text>
              <Text style={styles.amenityLocation}>Mid-flight service</Text>
            </View>
            
            <View style={styles.amenityCard}>
              <View style={styles.amenityIcon}>
                <Ionicons name="medical" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.amenityName}>Medical</Text>
              <Text style={styles.amenityDescription}>First aid & assistance</Text>
              <Text style={styles.amenityLocation}>Crew available</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6', // Ivory
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#333333', // Charcoal
    paddingBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fdfaf6', // Ivory
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e5c07b', // Champagne Gold
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fdfaf6', // Ivory
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  routeCard: {
    margin: 16,
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 16,
    padding: 20,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  airportInfo: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333', // Charcoal
    letterSpacing: -0.5,
  },
  cityName: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '500',
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '700',
    marginTop: 8,
  },
  flightPath: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  flightLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5c07b', // Champagne Gold
  },
  planeIcon: {
    marginHorizontal: 8,
    transform: [{ rotate: '90deg' }],
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5c07b', // Champagne Gold
  },
  duration: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '600',
  },
  aircraft: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '500',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333', // Charcoal
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  boardingCard: {
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 12,
    padding: 20,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  boardingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  boardingItem: {
    alignItems: 'center',
    flex: 1,
  },
  boardingLabel: {
    fontSize: 12,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  boardingValue: {
    fontSize: 16,
    color: '#333333', // Charcoal
    fontWeight: '700',
  },
  baggageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  baggageCard: {
    flex: 1,
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
  baggageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  baggageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333', // Charcoal
  },
  baggageText: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    marginBottom: 4,
    fontWeight: '500',
  },
  baggageFee: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '700',
    marginTop: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(253, 250, 246, 0.95)', // Ivory with opacity
    borderRadius: 8,
    padding: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333', // Charcoal
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityCard: {
    width: '48%',
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  amenityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f3e7', // Light champagne
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333', // Charcoal
    textAlign: 'center',
    marginBottom: 4,
  },
  amenityDescription: {
    fontSize: 12,
    color: '#1e3a8a', // Rich Navy
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  amenityLocation: {
    fontSize: 11,
    color: '#1e3a8a', // Rich Navy
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 30,
  },
});

// Screen options to hide the header
export const options = {
  headerShown: false,
}; 