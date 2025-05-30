import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

interface CruiseData {
  ticketNumber: string;
  cruiseLine: string;
  shipName: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
}

interface CabinInfo {
  deckNumber: string;
  cabinNumber: string;
  cabinType: string;
  roomPhone: string;
  bedSize: string;
  occupancy: string;
}

interface PortStop {
  date: string;
  port: string;
  arrivalTime: string;
  departureTime: string;
  status: 'In Port' | 'Docked' | 'At Sea' | 'Upcoming';
}

interface Restaurant {
  name: string;
  type: string;
  deck: string;
  hours: string;
  cuisine: string;
}

interface Shop {
  name: string;
  type: string;
  deck: string;
}

interface Entertainment {
  name: string;
  time: string;
  deck: string;
  type: string;
}

export default function CruiseDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedSection, setSelectedSection] = useState('overview');

  // Mock cruise data - in real app, this would come from API
  const cruiseData: CruiseData = {
    ticketNumber: (params.ticketNumber as string) || 'RC-2024-001',
    cruiseLine: (params.cruiseLine as string) || 'Royal Caribbean',
    shipName: (params.shipName as string) || 'Wonder of the Seas',
    departure: 'Miami, FL',
    destination: 'Caribbean Islands',
    startDate: 'Dec 15, 2024',
    endDate: 'Dec 22, 2024',
    duration: '7 days',
  };

  const cabinInfo: CabinInfo = {
    deckNumber: 'Deck 8',
    cabinNumber: '8142',
    cabinType: 'Ocean View Balcony',
    roomPhone: 'Ext. 8142',
    bedSize: 'Queen + Sofa Bed',
    occupancy: '4 guests max',
  };

  const itinerary: PortStop[] = [
    { date: 'Dec 15', port: 'Miami, FL', arrivalTime: 'All aboard', departureTime: '5:00 PM', status: 'Docked' },
    { date: 'Dec 16', port: 'At Sea', arrivalTime: '—', departureTime: '—', status: 'At Sea' },
    { date: 'Dec 17', port: 'Cozumel, Mexico', arrivalTime: '8:00 AM', departureTime: '6:00 PM', status: 'Upcoming' },
    { date: 'Dec 18', port: 'Costa Maya, Mexico', arrivalTime: '7:00 AM', departureTime: '4:00 PM', status: 'Upcoming' },
    { date: 'Dec 19', port: 'At Sea', arrivalTime: '—', departureTime: '—', status: 'Upcoming' },
    { date: 'Dec 20', port: 'Nassau, Bahamas', arrivalTime: '9:00 AM', departureTime: '7:00 PM', status: 'Upcoming' },
    { date: 'Dec 21', port: 'Perfect Day at CocoCay', arrivalTime: '8:00 AM', departureTime: '5:00 PM', status: 'Upcoming' },
    { date: 'Dec 22', port: 'Miami, FL', arrivalTime: '6:00 AM', departureTime: 'Disembark', status: 'Upcoming' },
  ];

  const restaurants: Restaurant[] = [
    { name: 'Main Dining Room', type: 'Complimentary', deck: 'Deck 3', hours: '6:00-9:30 PM', cuisine: 'International' },
    { name: 'Windjammer Marketplace', type: 'Buffet', deck: 'Deck 11', hours: '6:00 AM-12:00 AM', cuisine: 'Global' },
    { name: 'Chops Grille', type: 'Specialty', deck: 'Deck 4', hours: '6:00-9:30 PM', cuisine: 'Steakhouse' },
    { name: 'Giovanni\'s Table', type: 'Specialty', deck: 'Deck 5', hours: '6:00-9:30 PM', cuisine: 'Italian' },
    { name: 'Hooked Seafood', type: 'Specialty', deck: 'Deck 4', hours: '6:00-9:30 PM', cuisine: 'Seafood' },
    { name: 'Schooner Bar', type: 'Bar', deck: 'Deck 4', hours: '11:00 AM-2:00 AM', cuisine: 'Cocktails' },
  ];

  const shops: Shop[] = [
    { name: 'Royal Shops', type: 'Duty-Free', deck: 'Deck 4' },
    { name: 'Logo Shop', type: 'Apparel', deck: 'Deck 5' },
    { name: 'Jewelry & Gems', type: 'Jewelry', deck: 'Deck 4' },
    { name: 'Perfume & Cosmetics', type: 'Beauty', deck: 'Deck 4' },
    { name: 'Tech Zone', type: 'Electronics', deck: 'Deck 5' },
    { name: 'Gift Gallery', type: 'Gifts', deck: 'Deck 4' },
  ];

  const entertainment: Entertainment[] = [
    { name: 'Main Theater Show', time: '8:00 PM', deck: 'Deck 3', type: 'Theater' },
    { name: 'Comedy Show', time: '9:30 PM', deck: 'Deck 4', type: 'Comedy' },
    { name: 'Live Music', time: '7:00 PM', deck: 'Deck 5', type: 'Music' },
    { name: 'Pool Party', time: '2:00 PM', deck: 'Deck 11', type: 'Pool' },
    { name: 'Trivia Night', time: '10:00 PM', deck: 'Deck 6', type: 'Games' },
    { name: 'Dance Party', time: '11:00 PM', deck: 'Deck 6', type: 'Dance' },
  ];

  // Mock ship coordinates (in Caribbean)
  const shipCoordinates = {
    latitude: 21.1619,
    longitude: -86.8515,
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...shipCoordinates,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 1000);
    }
  }, []);

  const StatusIndicator = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'In Port':
        case 'Docked':
          return '#10b981';
        case 'At Sea':
          return '#0077b6';
        case 'Upcoming':
          return '#6b7280';
        default:
          return '#6b7280';
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case 'In Port':
        case 'Docked':
          return 'location';
        case 'At Sea':
          return 'boat';
        case 'Upcoming':
          return 'time';
        default:
          return 'ellipse';
      }
    };

    return (
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
        <Ionicons name={getStatusIcon() as any} size={12} color="#ffffff" />
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const ItineraryCard = ({ stop, index }: { stop: PortStop; index: number }) => (
    <View style={styles.itineraryCard}>
      <View style={styles.itineraryHeader}>
        <Text style={styles.itineraryDate}>{stop.date}</Text>
        <StatusIndicator status={stop.status} />
      </View>
      <Text style={styles.itineraryPort}>{stop.port}</Text>
      {stop.arrivalTime !== '—' && (
        <View style={styles.itineraryTimes}>
          <Text style={styles.itineraryTime}>Arrival: {stop.arrivalTime}</Text>
          <Text style={styles.itineraryTime}>Departure: {stop.departureTime}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{cruiseData.shipName}</Text>
          <Text style={styles.headerSubtitle}>{cruiseData.cruiseLine}</Text>
        </View>
        <View style={styles.ticketBadge}>
          <Text style={styles.ticketText}>{cruiseData.ticketNumber}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cruise Overview Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroShipName}>{cruiseData.shipName}</Text>
              <Text style={styles.heroRoute}>{cruiseData.departure} → {cruiseData.destination}</Text>
              <Text style={styles.heroDates}>{cruiseData.startDate} – {cruiseData.endDate}</Text>
              <Text style={styles.heroDuration}>{cruiseData.duration}</Text>
            </View>
          </View>
        </View>

        {/* Itinerary / Port Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="location" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Port Schedule</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.itineraryScroll}
            contentContainerStyle={styles.itineraryContainer}
          >
            {itinerary.map((stop, index) => (
              <ItineraryCard key={index} stop={stop} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Cabin Information */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="bed" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Cabin Information</Text>
          </View>
          <View style={styles.cabinCard}>
            <View style={styles.cabinRow}>
              <View style={styles.cabinItem}>
                <Ionicons name="layers" size={20} color="#0077b6" />
                <Text style={styles.cabinLabel}>Deck</Text>
                <Text style={styles.cabinValue}>{cabinInfo.deckNumber}</Text>
              </View>
              <View style={styles.cabinItem}>
                <Ionicons name="home" size={20} color="#0077b6" />
                <Text style={styles.cabinLabel}>Cabin</Text>
                <Text style={styles.cabinValue}>{cabinInfo.cabinNumber}</Text>
              </View>
            </View>
            <View style={styles.cabinRow}>
              <View style={styles.cabinItem}>
                <Ionicons name="bed" size={20} color="#0077b6" />
                <Text style={styles.cabinLabel}>Type</Text>
                <Text style={styles.cabinValue}>{cabinInfo.cabinType}</Text>
              </View>
              <View style={styles.cabinItem}>
                <Ionicons name="call" size={20} color="#0077b6" />
                <Text style={styles.cabinLabel}>Phone</Text>
                <Text style={styles.cabinValue}>{cabinInfo.roomPhone}</Text>
              </View>
            </View>
            <View style={styles.cabinDetails}>
              <View style={styles.cabinDetailRow}>
                <Ionicons name="bed" size={16} color="#0077b6" />
                <Text style={styles.cabinDetailText}>{cabinInfo.bedSize}</Text>
              </View>
              <View style={styles.cabinDetailRow}>
                <Ionicons name="people" size={16} color="#0077b6" />
                <Text style={styles.cabinDetailText}>{cabinInfo.occupancy}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dining Options */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="restaurant" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Dining & Food Options</Text>
          </View>
          <View style={styles.restaurantGrid}>
            {restaurants.map((restaurant, index) => (
              <View key={index} style={styles.restaurantCard}>
                <View style={styles.restaurantHeader}>
                  <Ionicons 
                    name={restaurant.type === 'Bar' ? 'wine' : 'restaurant'} 
                    size={20} 
                    color="#0077b6" 
                  />
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                </View>
                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                <Text style={styles.restaurantInfo}>{restaurant.deck} • {restaurant.hours}</Text>
                <Text style={styles.restaurantType}>{restaurant.type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Shopping */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="storefront" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Shops & Onboard Stores</Text>
          </View>
          <View style={styles.shopGrid}>
            {shops.map((shop, index) => (
              <View key={index} style={styles.shopCard}>
                <View style={styles.shopHeader}>
                  <Ionicons name="storefront" size={18} color="#004a77" />
                  <Text style={styles.shopName}>{shop.name}</Text>
                </View>
                <Text style={styles.shopType}>{shop.type}</Text>
                <Text style={styles.shopDeck}>{shop.deck}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Entertainment */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="musical-notes" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Today's Entertainment</Text>
          </View>
          <View style={styles.entertainmentList}>
            {entertainment.map((event, index) => (
              <View key={index} style={styles.entertainmentCard}>
                <View style={styles.entertainmentTime}>
                  <Ionicons name="time" size={16} color="#0077b6" />
                  <Text style={styles.entertainmentTimeText}>{event.time}</Text>
                </View>
                <View style={styles.entertainmentContent}>
                  <Text style={styles.entertainmentName}>{event.name}</Text>
                  <Text style={styles.entertainmentLocation}>{event.deck} • {event.type}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#d0e0f0" />
              </View>
            ))}
          </View>
        </View>

        {/* Live Map */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="map" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Live Ship Location</Text>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                ...shipCoordinates,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
              showsUserLocation={false}
            >
              <Marker
                coordinate={shipCoordinates}
                title="Wonder of the Seas"
                description="Current ship location"
              />
            </MapView>
            <View style={styles.mapOverlay}>
              <View style={styles.mapOverlayHeader}>
                <Ionicons name="boat" size={16} color="#0077b6" />
                <Text style={styles.mapOverlayText}>You are here</Text>
              </View>
              <Text style={styles.mapOverlaySubtext}>Speed: 22 knots • Weather: Sunny 78°F</Text>
            </View>
          </View>
        </View>

        {/* Contacts & Support */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="call" size={20} color="#004a77" />
            <Text style={styles.sectionTitle}>Contacts & Support</Text>
          </View>
          <View style={styles.contactsContainer}>
            <View style={styles.contactCard}>
              <Ionicons name="call" size={20} color="#0077b6" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Guest Services</Text>
                <Text style={styles.contactNumber}>Ext. 4000</Text>
              </View>
            </View>
            <View style={styles.contactCard}>
              <Ionicons name="restaurant" size={20} color="#0077b6" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Room Service</Text>
                <Text style={styles.contactNumber}>Ext. 7777</Text>
              </View>
            </View>
            <View style={styles.contactCard}>
              <Ionicons name="medical" size={20} color="#0077b6" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Medical Center</Text>
                <Text style={styles.contactNumber}>Ext. 911</Text>
              </View>
            </View>
            <View style={styles.contactCard}>
              <Ionicons name="location" size={20} color="#0077b6" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Shore Excursions</Text>
                <Text style={styles.contactNumber}>Ext. 8888</Text>
              </View>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#0077b6',
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#d0e0f0',
    marginTop: 2,
  },
  ticketBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ticketText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#004a77',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroGradient: {
    backgroundColor: '#0077b6',
    padding: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroShipName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroRoute: {
    fontSize: 16,
    color: '#d0e0f0',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroDates: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroDuration: {
    fontSize: 14,
    color: '#d0e0f0',
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0077b6',
    lineHeight: 20,
  },
  itineraryScroll: {
    maxHeight: 200,
  },
  itineraryContainer: {
    paddingRight: 16,
  },
  itineraryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 180,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itineraryDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0077b6',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  itineraryPort: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  itineraryTimes: {
    gap: 2,
  },
  itineraryTime: {
    fontSize: 12,
    color: '#64748b',
  },
  cabinCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cabinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cabinItem: {
    alignItems: 'center',
    flex: 1,
  },
  cabinLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 2,
  },
  cabinValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  cabinDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
  },
  cabinDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cabinDetailText: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '500',
  },
  restaurantGrid: {
    gap: 12,
  },
  restaurantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '500',
    marginBottom: 4,
  },
  restaurantInfo: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  restaurantType: {
    fontSize: 12,
    color: '#004a77',
    fontWeight: '600',
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 56) / 2,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  shopType: {
    fontSize: 12,
    color: '#0077b6',
    fontWeight: '500',
    marginBottom: 4,
  },
  shopDeck: {
    fontSize: 12,
    color: '#64748b',
  },
  entertainmentList: {
    gap: 12,
  },
  entertainmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entertainmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  entertainmentTimeText: {
    fontSize: 12,
    color: '#0077b6',
    fontWeight: '600',
  },
  entertainmentContent: {
    flex: 1,
  },
  entertainmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  entertainmentLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
  },
  mapOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  mapOverlayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0077b6',
    marginBottom: 2,
  },
  mapOverlaySubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  contactsContainer: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#0077b6',
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