// Shared types for TravelBuddy app

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profilePhoto?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  interests: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  interests: string[];
  accommodationType?: 'hotel' | 'hostel' | 'airbnb' | 'camping' | 'other';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'location';
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  isRead: boolean;
  createdAt: Date;
}

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    terminal?: string;
    gate?: string;
    scheduledTime: Date;
    estimatedTime?: Date;
    actualTime?: Date;
  };
  arrival: {
    airport: string;
    terminal?: string;
    gate?: string;
    scheduledTime: Date;
    estimatedTime?: Date;
    actualTime?: Date;
  };
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'delayed' | 'cancelled';
  aircraft?: string;
  lounges?: Lounge[];
  nearbyFood?: Restaurant[];
}

export interface CruiseInfo {
  shipId: string;
  shipName: string;
  cruiseLine: string;
  currentPort?: {
    name: string;
    country: string;
    arrivalTime?: Date;
    departureTime?: Date;
  };
  nextPort?: {
    name: string;
    country: string;
    estimatedArrival: Date;
  };
  events?: Event[];
  otherUsers?: User[];
}

export interface Lounge {
  id: string;
  name: string;
  terminal: string;
  amenities: string[];
  accessRequirements: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  location: string;
  isOpen: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  category: 'dining' | 'entertainment' | 'excursion' | 'other';
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  popularActivities: string[];
  averageBudget: {
    low: number;
    medium: number;
    high: number;
  };
  bestTimeToVisit: string[];
  rating: number;
}

export interface MapMarker {
  id: string;
  type: 'restaurant' | 'accommodation' | 'attraction' | 'user';
  title: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  category: string;
  rating?: number;
  imageUrl?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

// Chat WebSocket types
export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_joined' | 'user_left' | 'read_receipt';
  payload: any;
  timestamp: Date;
}

export interface TypingIndicator {
  userId: string;
  chatId: string;
  isTyping: boolean;
}

// Filter types
export interface MapFilters {
  categories: ('food' | 'accommodation' | 'attraction' | 'people')[];
  radius: number; // in kilometers
  priceRange?: ('$' | '$$' | '$$$' | '$$$$')[];
  rating?: number; // minimum rating
}

export interface TripFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  budget?: {
    min: number;
    max: number;
  };
  interests?: string[];
  destination?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'trip_match' | 'friend_request' | 'verification' | 'system';
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// App theme colors
export const COLORS = {
  primary: '#0077b6',
  primaryLight: '#d0e0f0',
  white: '#ffffff',
  primaryDark: '#004a77',
  muted: '#8a9ab0',
  // Additional colors for better UX
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF'
  },
  background: {
    primary: '#ffffff',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6'
  }
} as const; 