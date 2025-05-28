import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Paris',
        country: 'France',
        description: 'The City of Light, known for its art, culture, and cuisine.',
        imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52',
        latitude: 48.8566,
        longitude: 2.3522,
        popularActivities: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River Cruise'],
        budgetLow: 80,
        budgetMedium: 150,
        budgetHigh: 300,
        bestTimeToVisit: ['April', 'May', 'September', 'October'],
        rating: 4.8,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Tokyo',
        country: 'Japan',
        description: 'A vibrant metropolis blending traditional and modern culture.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
        latitude: 35.6762,
        longitude: 139.6503,
        popularActivities: ['Shibuya Crossing', 'Tokyo Skytree', 'Senso-ji Temple', 'Tsukiji Market'],
        budgetLow: 100,
        budgetMedium: 180,
        budgetHigh: 350,
        bestTimeToVisit: ['March', 'April', 'May', 'October', 'November'],
        rating: 4.7,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'New York City',
        country: 'United States',
        description: 'The city that never sleeps, a global hub of culture and commerce.',
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
        latitude: 40.7128,
        longitude: -74.0060,
        popularActivities: ['Statue of Liberty', 'Central Park', 'Times Square', 'Broadway Shows'],
        budgetLow: 120,
        budgetMedium: 200,
        budgetHigh: 400,
        bestTimeToVisit: ['April', 'May', 'September', 'October', 'November'],
        rating: 4.6,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Bali',
        country: 'Indonesia',
        description: 'Tropical paradise known for its beaches, temples, and culture.',
        imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1',
        latitude: -8.3405,
        longitude: 115.0920,
        popularActivities: ['Tanah Lot Temple', 'Ubud Rice Terraces', 'Mount Batur', 'Beaches'],
        budgetLow: 40,
        budgetMedium: 80,
        budgetHigh: 160,
        bestTimeToVisit: ['April', 'May', 'June', 'July', 'August', 'September'],
        rating: 4.9,
      },
    }),
  ]);

  // Create sample map markers
  const mapMarkers = await Promise.all([
    // Paris markers
    prisma.mapMarker.create({
      data: {
        type: 'RESTAURANT',
        title: 'Le Comptoir du Relais',
        description: 'Traditional French bistro with excellent wine selection',
        latitude: 48.8534,
        longitude: 2.3396,
        category: 'French Cuisine',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      },
    }),
    prisma.mapMarker.create({
      data: {
        type: 'ATTRACTION',
        title: 'Eiffel Tower',
        description: 'Iconic iron lattice tower and symbol of Paris',
        latitude: 48.8584,
        longitude: 2.2945,
        category: 'Landmark',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
      },
    }),
    // Tokyo markers
    prisma.mapMarker.create({
      data: {
        type: 'RESTAURANT',
        title: 'Sukiyabashi Jiro',
        description: 'World-renowned sushi restaurant',
        latitude: 35.6684,
        longitude: 139.7651,
        category: 'Sushi',
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
      },
    }),
    prisma.mapMarker.create({
      data: {
        type: 'ACCOMMODATION',
        title: 'Park Hyatt Tokyo',
        description: 'Luxury hotel with stunning city views',
        latitude: 35.6764,
        longitude: 139.7268,
        category: 'Hotel',
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      },
    }),
  ]);

  // Create sample flight info
  const flightInfo = await Promise.all([
    prisma.flightInfo.create({
      data: {
        flightNumber: 'AA123',
        airline: 'American Airlines',
        departureAirport: 'JFK',
        departureTerminal: '8',
        departureGate: 'A12',
        scheduledDeparture: new Date('2024-01-15T10:30:00Z'),
        arrivalAirport: 'LAX',
        arrivalTerminal: '4',
        arrivalGate: 'B23',
        scheduledArrival: new Date('2024-01-15T13:45:00Z'),
        status: 'SCHEDULED',
        aircraft: 'Boeing 777-300ER',
      },
    }),
    prisma.flightInfo.create({
      data: {
        flightNumber: 'BA456',
        airline: 'British Airways',
        departureAirport: 'LHR',
        departureTerminal: '5',
        departureGate: 'C45',
        scheduledDeparture: new Date('2024-01-16T14:20:00Z'),
        arrivalAirport: 'CDG',
        arrivalTerminal: '2E',
        arrivalGate: 'K12',
        scheduledArrival: new Date('2024-01-16T16:35:00Z'),
        status: 'BOARDING',
        aircraft: 'Airbus A350-1000',
      },
    }),
  ]);

  // Create sample cruise info
  const cruiseInfo = await Promise.all([
    prisma.cruiseInfo.create({
      data: {
        shipId: 'HARMONY-SEAS',
        shipName: 'Harmony of the Seas',
        cruiseLine: 'Royal Caribbean',
        currentPortName: 'Miami',
        currentPortCountry: 'United States',
        portArrivalTime: new Date('2024-01-14T08:00:00Z'),
        portDepartureTime: new Date('2024-01-14T18:00:00Z'),
        nextPortName: 'Cozumel',
        nextPortCountry: 'Mexico',
        nextPortETA: new Date('2024-01-16T10:00:00Z'),
      },
    }),
    prisma.cruiseInfo.create({
      data: {
        shipId: 'NORWEGIAN-EPIC',
        shipName: 'Norwegian Epic',
        cruiseLine: 'Norwegian Cruise Line',
        currentPortName: 'Barcelona',
        currentPortCountry: 'Spain',
        portArrivalTime: new Date('2024-01-15T07:00:00Z'),
        portDepartureTime: new Date('2024-01-15T19:00:00Z'),
        nextPortName: 'Rome',
        nextPortCountry: 'Italy',
        nextPortETA: new Date('2024-01-17T08:30:00Z'),
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📍 Created ${destinations.length} destinations`);
  console.log(`🗺️ Created ${mapMarkers.length} map markers`);
  console.log(`✈️ Created ${flightInfo.length} flight records`);
  console.log(`🚢 Created ${cruiseInfo.length} cruise records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 