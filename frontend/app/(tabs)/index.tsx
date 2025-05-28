import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/store/auth';

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
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);

  useEffect(() => {
    getCurrentLocation();
  }, []);

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
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => {
          if (filter.id === 'all') {
            setActiveFilters(['all']);
          } else {
            const newFilters = activeFilters.includes(filter.id)
              ? activeFilters.filter(f => f !== filter.id)
              : [...activeFilters.filter(f => f !== 'all'), filter.id];
            setActiveFilters(newFilters.length ? newFilters : ['all']);
          }
        }}
      >
        <Ionicons 
          name={filter.icon as any} 
          size={20} 
          color={isActive ? '#ffffff' : '#0077b6'} 
        />
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
          {filter.label}
        </Text>
      </TouchableOpacity>
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
        region={region}
        onRegionChange={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
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
          onPress={() => router.push('/destinations')}
        >
          <Ionicons name="add" size={24} color="#0077b6" />
        </TouchableOpacity>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity
          style={styles.destinationButton}
          onPress={() => router.push('/destinations')}
        >
          <Text style={styles.destinationButtonText}>Plan Your Trip</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
});
