import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

export interface TripPlanningData {
  destination: string;
  budget: number;
  interests: string[];
  numberOfPeople: number;
  startDate: Date | null;
  endDate: Date | null;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface TripPlanningState {
  currentTrip: TripPlanningData | null;
  
  // Actions
  updateTripData: (data: Partial<TripPlanningData>) => void;
  setTrip: (trip: TripPlanningData) => void;
  clearTrip: () => void;
}

const defaultTrip: TripPlanningData = {
  destination: '',
  budget: 0,
  interests: [],
  numberOfPeople: 1,
  startDate: null,
  endDate: null,
};

// Secure storage adapter for Zustand persist
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // Handle error silently
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // Handle error silently
    }
  },
};

export const useTripPlanningStore = create<TripPlanningState>()(
  persist(
    (set, get) => ({
      currentTrip: null,

      updateTripData: (data: Partial<TripPlanningData>) => {
        const currentTrip = get().currentTrip || defaultTrip;
        set({
          currentTrip: { ...currentTrip, ...data },
        });
      },

      setTrip: (trip: TripPlanningData) => {
        set({ currentTrip: trip });
      },

      clearTrip: () => {
        set({ currentTrip: null });
      },
    }),
    {
      name: 'travelbuddy-trip-planning',
      storage: createJSONStorage(() => secureStorage),
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            currentTrip: state.state.currentTrip ? {
              ...state.state.currentTrip,
              startDate: state.state.currentTrip.startDate?.toISOString(),
              endDate: state.state.currentTrip.endDate?.toISOString(),
            } : null,
          },
        });
      },
      deserialize: (str) => {
        const state = JSON.parse(str);
        return {
          ...state,
          state: {
            ...state.state,
            currentTrip: state.state.currentTrip ? {
              ...state.state.currentTrip,
              startDate: state.state.currentTrip.startDate ? new Date(state.state.currentTrip.startDate) : null,
              endDate: state.state.currentTrip.endDate ? new Date(state.state.currentTrip.endDate) : null,
            } : null,
          },
        };
      },
    }
  )
); 