import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#333333', // Charcoal
        tabBarInactiveTintColor: '#b8860b', // Darker Gold
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fdfaf6', // Ivory
          borderTopColor: '#d4af37', // Professional Gold
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="destinations"
        options={{
          title: 'Destinations',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'location' : 'location-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          title: 'Flights',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'airplane' : 'airplane-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cruise"
        options={{
          title: 'Cruises',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'boat' : 'boat-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
