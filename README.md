# TravelBuddy - Travel Planning & Social Connection App

TravelBuddy is a location-based travel companion app designed to help users discover destinations, connect with like-minded travelers, and get curated recommendations for dining, entertainment, and local experiences.

## Features

- **Location-based recommendations** with Google Maps integration
- **Social matching** with fellow travelers
- **Real-time flight & cruise information** 
- **Live chat** with WebSocket support
- **Trip planner** with saved preferences
- **User verification** and profile management

## Architecture

### Frontend
- **React Native** + Expo
- **Zustand** for state management
- **NativeWind** (Tailwind CSS for React Native)
- **React Navigation** for routing
- **WebSockets** for real-time chat

### Backend
- **Node.js** + Express
- **Prisma ORM** + PostgreSQL
- **Redis** for chat pub/sub
- **Firebase Authentication**
- **AWS S3** for file storage

## Project Structure

```
TravelBuddy/
├── frontend/          # React Native + Expo app
├── backend/           # Node.js + Express API
├── shared/            # Shared types and utilities
├── .github/           # CI/CD workflows
└── docs/              # Documentation
```

## Design System

**Color Palette:**
- Primary Blue: `#0077b6`
- Light Blue: `#d0e0f0` 
- White: `#ffffff`
- Dark Blue: `#004a77`
- Muted Blue: `#8a9ab0`

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Expo CLI
- iOS Simulator / Android Emulator

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd TravelBuddy
```

2. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

3. Set up environment variables
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Run database migrations
```bash
cd backend && npx prisma migrate dev
```

5. Start the development servers
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2) 
cd frontend && npm start
```

## Development

### Backend API
- Base URL: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/docs`

### Frontend App
- Metro bundler: `http://localhost:8081`
- Expo Dev Tools: `http://localhost:19002`

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Deployment

The app is configured for deployment on:
- **Backend**: Render/Vercel
- **Frontend**: Expo Application Services (EAS)

## Monitoring

- **Error Tracking**: Sentry
- **Analytics**: Mixpanel/Amplitude
- **Performance**: Expo dev tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
