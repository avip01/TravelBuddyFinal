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
          color={isActive ? '#ffffff' : '#0077b6'} 
        />
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
          {filter.label}
        </Text>
        {filter.id !== 'all' && (
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={14} 
            color={isActive ? '#ffffff' : '#0077b6'} 
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
            <Ionicons name={filterInfo.icon as any} size={20} color="#0077b6" />
            <Text style={styles.expandedFilterTitle}>Nearby {filterInfo.label}</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setExpandedFilter(null)}
          >
            <Ionicons name="close" size={18} color="#8a9ab0" />
          </TouchableOpacity>
        </View>
        <View style={styles.expandedFilterList}>
          {getMockListItems(expandedFilter).map((item, index) => (
            <TouchableOpacity key={index} style={styles.filterListItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.filterListItemText}>{item}</Text>
                <Text style={styles.filterListItemSubtext}>2.3 km away</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d0e0f0" />
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
          <Ionicons name="airplane" size={20} color="#0077b6" />
          <Text style={styles.tripInfoTitle}>Your Trip to {currentTrip.destination}</Text>
        </View>
        <View style={styles.tripInfoContent}>
          <View style={styles.tripInfoRow}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
            <Text style={styles.tripInfoText}>
              {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
            </Text>
          </View>
          <View style={styles.tripInfoRow}>
            <Ionicons name="people" size={16} color="#6B7280" />
            <Text style={styles.tripInfoText}>{currentTrip.numberOfPeople} travelers</Text>
          </View>
          <View style={styles.tripInfoRow}>
            <Ionicons name="card" size={16} color="#6B7280" />
            <Text style={styles.tripInfoText}>${currentTrip.budget} budget</Text>
          </View>
          {currentTrip.interests.length > 0 && (
            <View style={styles.tripInfoRow}>
              <Ionicons name="heart" size={16} color="#6B7280" />
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome{user ? `, ${user.displayName}` : ''}!
        </Text>
        <Text style={styles.headerSubtitle}>Discover amazing places around you</Text>
      </View>

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
          <Ionicons name="locate" size={24} color="#0077b6" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/destinations')}
        >
          <Ionicons name="add" size={24} color="#0077b6" />
        </TouchableOpacity>
      </View>

      {/* Bottom CTA */}
      {!currentTrip && (
        <View style={styles.bottomCTA}>
          <TouchableOpacity
            style={styles.destinationButton}
            onPress={() => router.push('/(tabs)/destinations')}
          >
            <Text style={styles.destinationButtonText}>Plan Your Trip</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  map: {
    flex: 1,
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
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077b6',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterContainer: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    borderColor: '#d0e0f0',
  },
  filterButtonActive: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  filterText: {
    fontSize: 12,
    marginTop: 4,
    color: '#0077b6',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  expandedContent: {
    padding: 12,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b6',
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
    color: '#1F2937',
    fontWeight: '500',
  },
  filterListItemSubtext: {
    fontSize: 12,
    color: '#8a9ab0',
    marginTop: 2,
  },
  listItemContent: {
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    gap: 12,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  destinationButton: {
    backgroundColor: '#0077b6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  destinationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripInfoCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: '#0077b6',
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
    color: '#6B7280',
    flex: 1,
  },
  expandedFilterCard: {
    position: 'absolute',
    top: 320,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: '#0077b6',
  },
  expandedFilterList: {
    gap: 8,
  },
  closeButton: {
    padding: 4,
  },
});
