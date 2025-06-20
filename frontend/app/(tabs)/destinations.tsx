import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useTripPlanningStore, TripPlanningData } from '@/store/tripPlanning';

const INTEREST_OPTIONS = [
  'Adventure', 'Culture', 'Food', 'Nightlife', 'Nature', 'History',
  'Art', 'Photography', 'Shopping', 'Relaxation', 'Sports', 'Music'
];

interface CityOption {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

// OpenStreetMap Nominatim API integration with fallback strategies
const searchCitiesAPI = async (query: string): Promise<CityOption[]> => {
  if (query.length < 2) {
    return [];
  }

  // Try multiple search strategies
  const searchStrategies = [
    // Strategy 1: Basic search
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&accept-language=en`,
    
    // Strategy 2: Search with city classification
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&class=place&type=city&accept-language=en`,
    
    // Strategy 3: Search as administrative area
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&class=boundary&type=administrative&accept-language=en`,
  ];

  for (const url of searchStrategies) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        continue; // Try next strategy
      }

      const data = await response.json();
      console.log('API Response for query:', query, data); // Debug log
      
      const results = data
        .filter((item: any) => {
          // Very permissive filtering - accept almost anything with coordinates
          const hasCoordinates = item.lat && item.lon;
          const hasName = item.name || item.display_name;
          
          return hasCoordinates && hasName;
        })
        .map((item: any) => {
          const nameParts = item.display_name.split(',');
          const cityName = item.name || nameParts[0].trim();
          let country = 'Unknown';
          
          // Try multiple ways to get country
          if (item.address?.country) {
            country = item.address.country;
          } else if (nameParts.length > 1) {
            country = nameParts[nameParts.length - 1].trim();
          }
          
          return {
            name: cityName,
            country: country,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            displayName: item.display_name,
          };
        })
        .slice(0, 8); // Limit to 8 results

      if (results.length > 0) {
        return results; // Return first successful result set
      }
    } catch (error) {
      console.error('Error with search strategy:', url, error);
      continue; // Try next strategy
    }
  }

  // If all strategies fail, return empty array
  console.log('All search strategies failed for query:', query);
  return [];
};

export default function DestinationsScreen() {
  const router = useRouter();
  const { updateTripData, currentTrip } = useTripPlanningStore();
  
  const [destination, setDestination] = useState(currentTrip?.destination || '');
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<CityOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [budget, setBudget] = useState(currentTrip?.budget || 0);
  const [budgetInputValue, setBudgetInputValue] = useState(`${currentTrip?.budget || 0}`);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentTrip?.interests || []);
  const [numberOfPeople, setNumberOfPeople] = useState(currentTrip?.numberOfPeople || 1);
  const [peopleInputValue, setPeopleInputValue] = useState(`${currentTrip?.numberOfPeople || 1}`);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(currentTrip?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(currentTrip?.endDate || null);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [isPeopleEditing, setIsPeopleEditing] = useState(false);

  // Cleanup function for search timeout
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce the search to avoid too many API calls
    const timeout = setTimeout(async () => {
      try {
        const cities = await searchCitiesAPI(query);
        setCitySuggestions(cities);
        setShowSuggestions(cities.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setCitySuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  const handleDestinationChange = (text: string) => {
    setDestination(text);
    setSelectedCity(null);
    searchCities(text);
  };

  const selectCity = (city: CityOption) => {
    setDestination(city.name);
    setSelectedCity(city);
    setShowSuggestions(false);
    setCitySuggestions([]);
    setIsSearching(false);
    
    // Clear any pending search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const getBudgetDescription = (budget: number) => {
    if (budget === 0) return 'No Budget Set';
    if (budget < 800) return 'Budget Travel';
    if (budget < 2000) return 'Mid-Range';
    if (budget < 4000) return 'Premium';
    return 'Luxury';
  };

  const handleBudgetInputChange = (text: string) => {
    setBudgetInputValue(text);
    const numValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    setBudget(numValue);
  };

  const handleBudgetInputSubmit = () => {
    const numValue = parseInt(budgetInputValue.replace(/[^0-9]/g, '')) || 0;
    setBudget(numValue);
    setBudgetInputValue(`${numValue}`);
    setIsBudgetEditing(false);
  };

  const handlePeopleInputChange = (text: string) => {
    setPeopleInputValue(text);
    const numValue = parseInt(text.replace(/[^0-9]/g, ''));
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setNumberOfPeople(numValue);
    }
  };

  const handlePeopleInputSubmit = () => {
    const numValue = parseInt(peopleInputValue.replace(/[^0-9]/g, ''));
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setNumberOfPeople(numValue);
      setPeopleInputValue(`${numValue}`);
    } else {
      setPeopleInputValue(`${numberOfPeople}`);
    }
    setIsPeopleEditing(false);
  };

  const handlePlanTrip = async () => {
    if (!destination.trim()) {
      Alert.alert('Missing Information', 'Please enter a destination');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Missing Information', 'Please select start and end dates');
      return;
    }

    // Get coordinates from selected city or search for it using API
    let coordinates = { latitude: 0, longitude: 0 };
    
    if (selectedCity) {
      coordinates = { latitude: selectedCity.latitude, longitude: selectedCity.longitude };
    } else {
      // Try to find the city using the API
      try {
        const cities = await searchCitiesAPI(destination);
        if (cities.length > 0) {
          const foundCity = cities[0]; // Use the first/best result
          coordinates = { latitude: foundCity.latitude, longitude: foundCity.longitude };
        } else {
          Alert.alert(
            'City Not Found', 
            `We couldn't find "${destination}". Please try selecting from the search suggestions or use a different city name.`,
            [{ text: 'OK' }]
          );
          return;
        }
      } catch (error) {
        Alert.alert(
          'Search Error', 
          'Unable to find city coordinates. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const tripData: TripPlanningData = {
      destination,
      budget,
      interests: selectedInterests,
      numberOfPeople,
      startDate,
      endDate,
      coordinates,
    };

    updateTripData(tripData);
    
    Alert.alert(
      'Trip Planned!', 
      `Your trip to ${destination} has been planned. Taking you to the map...`,
      [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Plan Your Adventure</Text>
          <Text style={styles.headerSubtitle}>Tell us about your dream destination</Text>
        </View>
      </View>

      {/* Destination Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Where to?</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location" size={20} color="#333333" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter any city worldwide..."
            value={destination}
            onChangeText={handleDestinationChange}
            placeholderTextColor="#6b7a99"
            onBlur={() => {
              // Hide suggestions after a brief delay to allow for selection
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onFocus={() => {
              // Show suggestions if there's text and suggestions available
              if (destination.length >= 2 && citySuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          {selectedCity && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={20} color="#e5c07b" />
            </View>
          )}
          {isSearching && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#1e3a8a" />
            </View>
          )}
        </View>

        {/* City Suggestions */}
        {(showSuggestions && citySuggestions.length > 0) && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={citySuggestions}
              keyExtractor={(item) => `${item.latitude}-${item.longitude}-${item.name}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectCity(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.suggestionContent}>
                    <Ionicons name="location-outline" size={16} color="#1e3a8a" style={styles.suggestionIcon} />
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionText}>{item.name}</Text>
                      <Text style={styles.suggestionCountry}>{item.country}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
              scrollEnabled={false}
              style={styles.suggestionsList}
            />
          </View>
        )}

        {/* No results message */}
        {destination.length >= 2 && !isSearching && !showSuggestions && citySuggestions.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No cities found. Try a different search term.</Text>
          </View>
        )}
      </View>

      {/* Budget Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget per person</Text>
        <View style={styles.budgetContainer}>
          <View style={styles.budgetInputContainer}>
            <Text style={styles.budgetLabel}>{getBudgetDescription(budget)}</Text>
            <View style={styles.budgetRow}>
              <TouchableOpacity
                style={styles.budgetButton}
                onPress={() => setBudget(Math.max(0, budget - 100))}
              >
                <Ionicons name="remove" size={20} color="#f5f3ef" />
              </TouchableOpacity>
              {isBudgetEditing ? (
                <TextInput
                  style={styles.budgetInput}
                  value={budgetInputValue}
                  onChangeText={handleBudgetInputChange}
                  onSubmitEditing={handleBudgetInputSubmit}
                  onBlur={handleBudgetInputSubmit}
                  keyboardType="numeric"
                  autoFocus
                  selectTextOnFocus
                />
              ) : (
                <TouchableOpacity 
                  style={styles.budgetTouchable}
                  onPress={() => setIsBudgetEditing(true)}
                >
                  <Text style={styles.budgetDisplay}>${budget}</Text>
                  <View style={styles.editIndicator}>
                    <Ionicons name="pencil" size={12} color="#333333" />
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.budgetButton}
                onPress={() => setBudget(budget + 100)}
              >
                <Ionicons name="add" size={20} color="#f5f3ef" />
              </TouchableOpacity>
            </View>
            <View style={styles.budgetRange}>
              <Text style={styles.budgetRangeText}>$0</Text>
              <View style={styles.budgetSliderTrack}>
                <View 
                  style={[
                    styles.budgetSliderFill,
                    { width: `${((budget - 0) / 4000) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.budgetRangeText}>$4000+</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Number of People */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How many travelers?</Text>
        <View style={styles.peopleContainer}>
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
          >
            <Ionicons name="remove" size={20} color="#f5f3ef" />
          </TouchableOpacity>
          {isPeopleEditing ? (
            <TextInput
              style={styles.peopleCountInput}
              value={peopleInputValue}
              onChangeText={handlePeopleInputChange}
              onSubmitEditing={handlePeopleInputSubmit}
              onBlur={handlePeopleInputSubmit}
              keyboardType="numeric"
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity 
              style={styles.peopleTouchable}
              onPress={() => setIsPeopleEditing(true)}
            >
              <Text style={styles.peopleCount}>{numberOfPeople}</Text>
              <View style={styles.editIndicator}>
                <Ionicons name="pencil" size={12} color="#333333" />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => setNumberOfPeople(numberOfPeople + 1)}
          >
            <Ionicons name="add" size={20} color="#f5f3ef" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What interests you?</Text>
        <View style={styles.interestsContainer}>
          {INTEREST_OPTIONS.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestChip,
                selectedInterests.includes(interest) && styles.interestChipSelected
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestText,
                selectedInterests.includes(interest) && styles.interestTextSelected
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>When are you traveling?</Text>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartCalendar(!showStartCalendar)}
        >
          <Ionicons name="calendar" size={20} color="#333333" />
          <Text style={styles.dateButtonText}>
            Start Date: {startDate ? startDate.toDateString() : 'Select start date'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#d4af37" />
        </TouchableOpacity>

        {showStartCalendar && (
          <Calendar
            onDayPress={(day) => {
              const selectedDate = new Date(day.year, day.month - 1, day.day);
              setStartDate(selectedDate);
              setShowStartCalendar(false);
            }}
            theme={{
              selectedDayBackgroundColor: '#1e3a8a',
              todayTextColor: '#1e3a8a',
              arrowColor: '#1e3a8a',
            }}
          />
        )}

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndCalendar(!showEndCalendar)}
        >
          <Ionicons name="calendar" size={20} color="#333333" />
          <Text style={styles.dateButtonText}>
            End Date: {endDate ? endDate.toDateString() : 'Select end date'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#d4af37" />
        </TouchableOpacity>

        {showEndCalendar && (
          <Calendar
            onDayPress={(day) => {
              const selectedDate = new Date(day.year, day.month - 1, day.day);
              setEndDate(selectedDate);
              setShowEndCalendar(false);
            }}
            minDate={startDate?.toISOString().split('T')[0]}
            theme={{
              selectedDayBackgroundColor: '#1e3a8a',
              todayTextColor: '#1e3a8a',
              arrowColor: '#1e3a8a',
            }}
          />
        )}
      </View>

      {/* Plan Trip Button */}
      <TouchableOpacity style={styles.planButton} onPress={handlePlanTrip}>
        <Text style={styles.planButtonText}>Plan My Trip</Text>
        <Ionicons name="arrow-forward" size={20} color="#f5f3ef" />
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ef', // Soft cream/ivory
  },
  headerSection: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f5f3ef', // Soft cream/ivory
  },
  headerCard: {
    backgroundColor: '#333333', // Charcoal
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff', // White
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#d4af37', // Champagne gold
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
    color: '#333333', // Charcoal for subtle contrast
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Pure white for input
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#d4af37', // Champagne gold border
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e3a8a', // Deep navy text
    fontWeight: '500',
  },
  selectedIndicator: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  budgetContainer: {
    backgroundColor: '#ffffff', // Pure white
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#d4af37', // Champagne gold border
  },
  budgetInputContainer: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#333333', // Charcoal
    fontWeight: '600',
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e3a8a', // Deep navy
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  budgetDisplay: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333', // Charcoal for strong contrast
    marginHorizontal: 20,
    minWidth: 120,
    textAlign: 'center',
  },
  budgetInput: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333', // Charcoal for strong contrast
    marginHorizontal: 20,
    minWidth: 120,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37', // Champagne gold
  },
  budgetRange: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  budgetRangeText: {
    fontSize: 12,
    color: '#1e3a8a', // Deep navy
    fontWeight: '500',
    width: 50,
    textAlign: 'center',
  },
  budgetSliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#e8e4dd', // Light cream
    borderRadius: 2,
    marginHorizontal: 10,
  },
  budgetSliderFill: {
    height: 4,
    backgroundColor: '#d4af37', // Champagne gold
    borderRadius: 2,
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Pure white
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#d4af37', // Champagne gold border
  },
  peopleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e3a8a', // Deep navy
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  peopleTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  peopleCount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333333', // Charcoal for strong contrast
    marginHorizontal: 30,
    minWidth: 60,
    textAlign: 'center',
  },
  peopleCountInput: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333333', // Charcoal for strong contrast
    marginHorizontal: 30,
    minWidth: 60,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37', // Champagne gold
  },
  editIndicator: {
    marginLeft: -8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff', // Pure white
    borderWidth: 1.5,
    borderColor: '#d4af37', // Champagne gold border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  interestChipSelected: {
    backgroundColor: '#d4af37', // Champagne gold fill
    borderColor: '#d4af37', // Champagne gold border
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e3a8a', // Deep navy
  },
  interestTextSelected: {
    color: '#1e3a8a', // Keep navy for contrast on gold
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Pure white
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#d4af37', // Champagne gold border
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1e3a8a', // Deep navy
    fontWeight: '500',
    marginLeft: 12,
  },
  planButton: {
    backgroundColor: '#1e3a8a', // Deep navy
    borderRadius: 12,
    padding: 18,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  planButtonText: {
    color: '#f5f3ef', // Cream/ivory text
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 30,
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff', // Pure white
    borderRadius: 12,
    marginTop: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 200,
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5c07b20', // Light champagne gold border
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333333', // Charcoal
    fontWeight: '600',
  },
  suggestionCountry: {
    fontSize: 14,
    color: '#1e3a8a', // Rich navy
    fontWeight: '400',
    opacity: 0.8,
  },
  noResultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 8,
    marginHorizontal: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  noResultsText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    opacity: 0.7,
  },
}); 