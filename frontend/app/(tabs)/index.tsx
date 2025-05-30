import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/store/auth';
import { useTripPlanningStore } from '@/store/tripPlanning';

interface MapMarker {
  id: string;
  type: 'restaurant' | 'accommodation' | 'attraction' | 'user';
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  category: string;
  rating?: number;
}

const INITIAL_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { currentTrip } = useTripPlanningStore();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Update map location when trip is planned
    if (currentTrip?.coordinates && mapRef.current) {
      const newRegion = {
        latitude: currentTrip.coordinates.latitude,
        longitude: currentTrip.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
      
      // Load markers for the new destination
      loadNearbyMarkers(currentTrip.coordinates.latitude, currentTrip.coordinates.longitude);
    }
  }, [currentTrip]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied. Please enable location services to get personalized recommendations.'
        );
        setIsLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      
      // Animate to the new location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      
      // Load nearby markers
      loadNearbyMarkers(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNearbyMarkers = async (latitude: number, longitude: number) => {
    // Mock data for now - this will be replaced with API calls
    const mockMarkers: MapMarker[] = [
      {
        id: '1',
        type: 'restaurant',
        title: 'Local Bistro',
        description: 'Authentic local cuisine',
        coordinate: {
          latitude: latitude + 0.01,
          longitude: longitude + 0.01,
        },
        category: 'French',
        rating: 4.5,
      },
      {
        id: '2',
        type: 'attraction',
        title: 'City Museum',
        description: 'Historical artifacts and art',
        coordinate: {
          latitude: latitude - 0.01,
          longitude: longitude - 0.01,
        },
        category: 'Museum',
        rating: 4.7,
      },
      {
        id: '3',
        type: 'accommodation',
        title: 'Cozy Hotel',
        description: 'Comfortable stay in the heart of the city',
        coordinate: {
          latitude: latitude + 0.005,
          longitude: longitude - 0.005,
        },
        category: 'Hotel',
        rating: 4.3,
      },
    ];
    
    setMarkers(mockMarkers);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'restaurant';
      case 'accommodation':
        return 'bed';
      case 'attraction':
        return 'camera';
      case 'user':
        return 'person';
      default:
        return 'location';
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'food', label: 'Food', icon: 'restaurant' },
    { id: 'accommodation', label: 'Stay', icon: 'bed' },
    { id: 'attraction', label: 'Attractions', icon: 'camera' },
    { id: 'people', label: 'People', icon: 'people' },
  ];

  const FilterButton = ({ filter }: { filter: typeof filterOptions[0] }) => {
    const isActive = activeFilters.includes(filter.id);
    const isExpanded = expandedFilter === filter.id;
    
    const handleFilterPress = () => {
      if (filter.id === 'all') {
        setActiveFilters(['all']);
        setExpandedFilter(null);
      } else {
        const newFilters = activeFilters.includes(filter.id)
          ? activeFilters.filter(f => f !== filter.id)
          : [...activeFilters.filter(f => f !== 'all'), filter.id];
        setActiveFilters(newFilters.length ? newFilters : ['all']);
        
        // Toggle expanded state
        setExpandedFilter(isExpanded ? null : filter.id);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={handleFilterPress}
      >
        <Ionicons 
          name={filter.icon as any} 
          size={20} 
          color={isActive ? '#fdfaf6' : '#1e3a8a'} 
        />
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
          {filter.label}
        </Text>
        {filter.id !== 'all' && (
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={14} 
            color={isActive ? '#fdfaf6' : '#1e3a8a'} 
          />
        )}
      </TouchableOpacity>
    );
  };

  const ExpandedFilterContent = () => {
    if (!expandedFilter || expandedFilter === 'all') return null;

    const getMockListItems = (filterId: string) => {
      switch (filterId) {
        case 'food':
          return ['Italian Restaurant', 'Local Street Food', 'Coffee Shop', 'Fine Dining'];
        case 'accommodation':
          return ['Luxury Hotel', 'Budget Hostel', 'Boutique B&B', 'Vacation Rental'];
        case 'attraction':
          return ['Historical Museum', 'Art Gallery', 'City Park', 'Landmark Tour'];
        case 'people':
          return ['Solo Travelers (5)', 'Adventure Group (3)', 'Photography Club (8)', 'Food Lovers (12)'];
        default:
          return [];
      }
    };

    const filterInfo = filterOptions.find(f => f.id === expandedFilter);
    if (!filterInfo) return null;

    return (
      <View style={styles.expandedFilterCard}>
        <View style={styles.expandedFilterHeader}>
          <View style={styles.expandedFilterTitleRow}>
            <Ionicons name={filterInfo.icon as any} size={20} color="#1e3a8a" />
            <Text style={styles.expandedFilterTitle}>Nearby {filterInfo.label}</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setExpandedFilter(null)}
          >
            <Ionicons name="close" size={18} color="#d4af37" />
          </TouchableOpacity>
        </View>
        <View style={styles.expandedFilterList}>
          {getMockListItems(expandedFilter).map((item, index) => (
            <TouchableOpacity key={index} style={styles.filterListItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.filterListItemText}>{item}</Text>
                <Text style={styles.filterListItemSubtext}>2.3 km away</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d4af37" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const TripInfoCard = () => {
    if (!currentTrip) return null;

    const formatDate = (date: Date | null) => {
      if (!date) return 'Not set';
      return new Date(date).toLocaleDateString();
    };

    return (
      <View style={styles.tripInfoCard}>
        <View style={styles.tripInfoHeader}>
          <Ionicons name="airplane" size={20} color="#1e3a8a" />
          <Text style={styles.tripInfoTitle}>Your Trip to {currentTrip.destination}</Text>
        </View>
        <View style={styles.tripInfoContent}>
          <View style={styles.tripInfoRow}>
            <Ionicons name="calendar" size={16} color="#d4af37" />
            <Text style={styles.tripInfoText}>
              {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
            </Text>
          </View>
          <View style={styles.tripInfoRow}>
            <Ionicons name="people" size={16} color="#d4af37" />
            <Text style={styles.tripInfoText}>{currentTrip.numberOfPeople} travelers</Text>
          </View>
          <View style={styles.tripInfoRow}>
            <Ionicons name="card" size={16} color="#d4af37" />
            <Text style={styles.tripInfoText}>${currentTrip.budget} budget</Text>
          </View>
          {currentTrip.interests.length > 0 && (
            <View style={styles.tripInfoRow}>
              <Ionicons name="heart" size={16} color="#d4af37" />
              <Text style={styles.tripInfoText}>
                {currentTrip.interests.slice(0, 3).join(', ')}
                {currentTrip.interests.length > 3 && ` +${currentTrip.interests.length - 3} more`}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077b6" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Travel Card - moved to top */}
      <View style={styles.header}>
        <View style={styles.heroGradient}>
          <Text style={styles.heroTitle}>
            {currentTrip?.destination ? `Welcome to ${currentTrip.destination}!` : 'Travel Buddy'}
          </Text>
          <Text style={styles.heroSubtitle}>Discover amazing places around you</Text>
          <Ionicons name="airplane" size={64} color="#e5c07b" style={styles.heroIcon} />
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        moveOnMarkerPress={false}
        pitchEnabled={true}
        rotateEnabled={false}
        loadingEnabled={false}
        ref={mapRef}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <FilterButton key={filter.id} filter={filter} />
        ))}
      </View>

      {/* Expanded Filter Content */}
      <ExpandedFilterContent />

      {/* Trip Info Card */}
      {currentTrip && <TripInfoCard />}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/destinations')}
        >
          <Ionicons name="add" size={24} color="#1e3a8a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6', // Ivory
  },
  map: {
    flex: 1,
    marginTop: 0, // Remove margin since header is now overlay
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0077b6',
    fontWeight: '500',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  heroGradient: {
    backgroundColor: 'rgba(51, 51, 51, 0.85)', // Charcoal with transparency
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1e3a8a', // Rich Navy
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fdfaf6', // Ivory
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#d4af37', // Professional Gold
    fontWeight: '400',
    opacity: 0.9,
  },
  heroIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.3,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333', // Charcoal
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fdfaf6', // Ivory
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e5c07b', // Champagne Gold
  },
  gridIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333', // Charcoal
    textAlign: 'center',
    marginBottom: 6,
  },
  gridSubtitle: {
    fontSize: 12,
    color: '#1e3a8a', // Rich Navy
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  featureDescription: {
    fontSize: 14,
    color: '#1e3a8a', // Rich Navy
    lineHeight: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e5c07b', // Champagne Gold
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#333333', // Charcoal
    fontWeight: '600',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 30,
  },
  filterContainer: {
    position: 'absolute',
    top: 200, // Adjusted for overlay header
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(253, 250, 246, 0.95)', // Ivory with opacity
    borderRadius: 12,
    padding: 12,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#d4af37', // Professional Gold
  },
  filterButtonContainer: {
    alignItems: 'center',
  },
  filterButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d4af37', // Professional Gold
  },
  filterButtonActive: {
    backgroundColor: '#1e3a8a', // Rich Navy
    borderColor: '#1e3a8a', // Rich Navy
  },
  filterText: {
    fontSize: 12,
    marginTop: 4,
    color: '#1e3a8a', // Rich Navy
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fdfaf6', // Ivory
  },
  expandedContent: {
    padding: 12,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a', // Rich Navy
    marginBottom: 8,
  },
  filterListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterListItemText: {
    fontSize: 14,
    color: '#333333', // Charcoal
    fontWeight: '500',
  },
  filterListItemSubtext: {
    fontSize: 12,
    color: '#1e3a8a', // Rich Navy
    marginTop: 2,
  },
  listItemContent: {
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 120,
    right: 36, // Moved further left to fit inside info card
    gap: 12,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fdfaf6', // Ivory
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#d4af37', // Professional Gold
  },
  tripInfoCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(253, 250, 246, 0.95)', // Ivory with opacity
    borderRadius: 12,
    padding: 16,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#d4af37', // Professional Gold
  },
  tripInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tripInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a', // Rich Navy
  },
  tripInfoContent: {
    gap: 8,
  },
  tripInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripInfoText: {
    fontSize: 14,
    color: '#333333', // Charcoal
    flex: 1,
  },
  expandedFilterCard: {
    position: 'absolute',
    top: 340, // Adjusted for overlay header
    left: 20,
    right: 20,
    backgroundColor: 'rgba(253, 250, 246, 0.95)', // Ivory with opacity
    borderRadius: 12,
    padding: 16,
    shadowColor: '#333333', // Charcoal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#d4af37', // Professional Gold
  },
  expandedFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expandedFilterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandedFilterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a', // Rich Navy
  },
  expandedFilterList: {
    gap: 8,
  },
  closeButton: {
    padding: 4,
  },
});
