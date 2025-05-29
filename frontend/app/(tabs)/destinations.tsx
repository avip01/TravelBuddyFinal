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
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useTripPlanningStore, TripPlanningData } from '@/store/tripPlanning';

const INTEREST_OPTIONS = [
  'Adventure', 'Culture', 'Food', 'Nightlife', 'Nature', 'History',
  'Art', 'Photography', 'Shopping', 'Relaxation', 'Sports', 'Music'
];

export default function DestinationsScreen() {
  const router = useRouter();
  const { updateTripData, currentTrip } = useTripPlanningStore();
  
  const [destination, setDestination] = useState(currentTrip?.destination || '');
  const [budget, setBudget] = useState(currentTrip?.budget || 1500);
  const [budgetInputValue, setBudgetInputValue] = useState(`${currentTrip?.budget || 1500}`);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentTrip?.interests || []);
  const [numberOfPeople, setNumberOfPeople] = useState(currentTrip?.numberOfPeople || 1);
  const [peopleInputValue, setPeopleInputValue] = useState(`${currentTrip?.numberOfPeople || 1}`);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(currentTrip?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(currentTrip?.endDate || null);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [isPeopleEditing, setIsPeopleEditing] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const getBudgetDescription = (budget: number) => {
    if (budget < 800) return 'Budget Travel';
    if (budget < 2000) return 'Mid-Range';
    if (budget < 4000) return 'Premium';
    return 'Luxury';
  };

  const handleBudgetInputChange = (text: string) => {
    setBudgetInputValue(text);
    const numValue = parseInt(text.replace(/[^0-9]/g, ''));
    if (!isNaN(numValue) && numValue >= 500) {
      setBudget(numValue);
    }
  };

  const handleBudgetInputSubmit = () => {
    const numValue = parseInt(budgetInputValue.replace(/[^0-9]/g, ''));
    if (!isNaN(numValue) && numValue >= 500) {
      setBudget(numValue);
      setBudgetInputValue(`${numValue}`);
    } else {
      setBudgetInputValue(`${budget}`);
    }
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

    // Mock coordinates for demo - in real app, you'd geocode the destination
    const mockCoordinates = {
      'Paris': { latitude: 48.8566, longitude: 2.3522 },
      'Tokyo': { latitude: 35.6762, longitude: 139.6503 },
      'New York': { latitude: 40.7128, longitude: -74.0060 },
      'London': { latitude: 51.5074, longitude: -0.1278 },
      'Bali': { latitude: -8.3405, longitude: 115.0920 },
    };

    const coordinates = mockCoordinates[destination as keyof typeof mockCoordinates] || 
                       { latitude: 0, longitude: 0 };

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plan Your Adventure</Text>
        <Text style={styles.headerSubtitle}>Tell us about your dream destination</Text>
      </View>

      {/* Destination Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Where to?</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location" size={20} color="#0077b6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter destination (e.g., Paris, Tokyo, Bali)"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#8a9ab0"
          />
        </View>
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
                onPress={() => setBudget(Math.max(500, budget - 100))}
              >
                <Ionicons name="remove" size={20} color="#0077b6" />
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
                <TouchableOpacity onPress={() => setIsBudgetEditing(true)}>
                  <Text style={styles.budgetDisplay}>${budget}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.budgetButton}
                onPress={() => setBudget(budget + 100)}
              >
                <Ionicons name="add" size={20} color="#0077b6" />
              </TouchableOpacity>
            </View>
            <View style={styles.budgetRange}>
              <Text style={styles.budgetRangeText}>$500</Text>
              <View style={styles.budgetSliderTrack}>
                <View 
                  style={[
                    styles.budgetSliderFill,
                    { width: `${((budget - 500) / 3500) * 100}%` }
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
            <Ionicons name="remove" size={20} color="#0077b6" />
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
            <TouchableOpacity onPress={() => setIsPeopleEditing(true)}>
              <Text style={styles.peopleCount}>{numberOfPeople}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => setNumberOfPeople(numberOfPeople + 1)}
          >
            <Ionicons name="add" size={20} color="#0077b6" />
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
          <Ionicons name="calendar" size={20} color="#0077b6" />
          <Text style={styles.dateButtonText}>
            Start Date: {startDate ? startDate.toDateString() : 'Select start date'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#8a9ab0" />
        </TouchableOpacity>

        {showStartCalendar && (
          <Calendar
            onDayPress={(day) => {
              setStartDate(new Date(day.timestamp));
              setShowStartCalendar(false);
            }}
            theme={{
              selectedDayBackgroundColor: '#0077b6',
              todayTextColor: '#0077b6',
              arrowColor: '#0077b6',
            }}
          />
        )}

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndCalendar(!showEndCalendar)}
        >
          <Ionicons name="calendar" size={20} color="#0077b6" />
          <Text style={styles.dateButtonText}>
            End Date: {endDate ? endDate.toDateString() : 'Select end date'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#8a9ab0" />
        </TouchableOpacity>

        {showEndCalendar && (
          <Calendar
            onDayPress={(day) => {
              setEndDate(new Date(day.timestamp));
              setShowEndCalendar(false);
            }}
            minDate={startDate?.toISOString().split('T')[0]}
            theme={{
              selectedDayBackgroundColor: '#0077b6',
              todayTextColor: '#0077b6',
              arrowColor: '#0077b6',
            }}
          />
        )}
      </View>

      {/* Plan Trip Button */}
      <TouchableOpacity style={styles.planButton} onPress={handlePlanTrip}>
        <Text style={styles.planButtonText}>Plan My Trip</Text>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </TouchableOpacity>

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
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  budgetContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  budgetInputContainer: {
    gap: 14,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#0ea5e9',
    textAlign: 'center',
    fontWeight: '600',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  budgetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  budgetInput: {
    width: 100,
    fontSize: 20,
    color: '#1e293b',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  budgetRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  budgetRangeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    minWidth: 35,
  },
  budgetSliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  budgetSliderFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 2,
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  peopleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  peopleCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0ea5e9',
    marginHorizontal: 28,
  },
  peopleCountInput: {
    width: 70,
    fontSize: 24,
    color: '#0ea5e9',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 28,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  interestChipSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  interestText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  interestTextSelected: {
    color: '#ffffff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    marginLeft: 10,
    fontWeight: '500',
  },
  planButton: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  planButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  budgetDisplay: {
    fontSize: 20,
    color: '#1e293b',
    fontWeight: '700',
    width: 100,
    textAlign: 'center',
    padding: 10,
  },
  bottomSpacing: {
    height: 30,
  },
}); 