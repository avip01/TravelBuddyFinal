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
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{flightData.flightNumber}</Text>
          <Text style={styles.headerSubtitle}>{flightData.airline}</Text>
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
              <Ionicons name="airplane" size={20} color="#0ea5e9" style={styles.planeIcon} />
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
                <Ionicons name="business" size={20} color="#0ea5e9" />
                <Text style={styles.boardingLabel}>Terminal</Text>
                <Text style={styles.boardingValue}>{flightData.terminal}</Text>
              </View>
              <View style={styles.boardingItem}>
                <Ionicons name="exit" size={20} color="#0ea5e9" />
                <Text style={styles.boardingLabel}>Gate</Text>
                <Text style={styles.boardingValue}>{flightData.gate}</Text>
              </View>
            </View>
            <View style={styles.boardingRow}>
              <View style={styles.boardingItem}>
                <Ionicons name="time" size={20} color="#0ea5e9" />
                <Text style={styles.boardingLabel}>Boarding</Text>
                <Text style={styles.boardingValue}>3:40 PM</Text>
              </View>
              <View style={styles.boardingItem}>
                <Ionicons name="call" size={20} color="#0ea5e9" />
                <Text style={styles.boardingLabel}>Support</Text>
                <Text style={styles.boardingValue}>(123) 456-7890</Text>
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
                <Ionicons name="bag-handle" size={24} color="#0ea5e9" />
                <Text style={styles.baggageTitle}>Carry-on</Text>
              </View>
              <Text style={styles.baggageText}>Dimensions: {baggageInfo.carryon.dimensions}</Text>
              <Text style={styles.baggageText}>Weight: {baggageInfo.carryon.weight}</Text>
            </View>
            
            <View style={styles.baggageCard}>
              <View style={styles.baggageHeader}>
                <Ionicons name="bag" size={24} color="#0ea5e9" />
                <Text style={styles.baggageTitle}>Checked Bag</Text>
              </View>
              <Text style={styles.baggageText}>Dimensions: {baggageInfo.checked.dimensions}</Text>
              <Text style={styles.baggageText}>Weight: {baggageInfo.checked.weight}</Text>
              <Text style={styles.baggageFee}>Fee: {baggageInfo.checked.fee}</Text>
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
            {airportAmenities.map((amenity, index) => (
              <View key={index} style={styles.amenityCard}>
                <View style={styles.amenityIcon}>
                  <Ionicons name={amenity.icon as any} size={24} color="#0ea5e9" />
                </View>
                <Text style={styles.amenityName}>{amenity.name}</Text>
                <Text style={styles.amenityDescription}>{amenity.description}</Text>
                <Text style={styles.amenityLocation}>{amenity.location}</Text>
              </View>
            ))}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1e293b',
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
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  routeCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  cityName: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#0ea5e9',
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
    backgroundColor: '#cbd5e1',
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
    borderTopColor: '#f1f5f9',
  },
  duration: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  aircraft: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  boardingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#64748b',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  boardingValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
  },
  baggageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  baggageCard: {
    flex: 1,
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
  baggageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  baggageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  baggageText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  baggageFee: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '700',
    marginTop: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#1e293b',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  amenityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  amenityDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  amenityLocation: {
    fontSize: 11,
    color: '#94a3b8',
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