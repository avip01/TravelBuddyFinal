import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SmokePoint {
  id: string;
  x: number;
  y: number;
  opacity: Animated.Value;
  size: number;
}

export default function SplashScreen() {
  // Start plane from bottom left, go to top right - centered on screen
  const planePosition = useRef(new Animated.ValueXY({ x: -80, y: height * 0.75 })).current;
  const planeOpacity = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const dotAnimation1 = useRef(new Animated.Value(0)).current;
  const dotAnimation2 = useRef(new Animated.Value(0)).current;
  const dotAnimation3 = useRef(new Animated.Value(0)).current;
  
  // State to track smoke trail points
  const [smokeTrail, setSmokeTrail] = useState<SmokePoint[]>([]);

  useEffect(() => {
    const startAnimation = async () => {
      // Play airport announcement sound using local mp3
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });

        // Use local airport ding sound
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/bingbong-42645.mp3'),
          { 
            shouldPlay: true, 
            volume: 0.4,
            isLooping: false,
          }
        );
        
        setTimeout(async () => {
          try {
            await sound.unloadAsync();
          } catch (e) {
            console.log('Sound cleanup error:', e);
          }
        }, 2000);
      } catch (error) {
        console.log('Audio playback failed:', error);
      }

      // Start loading dots animation
      const animateDots = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dotAnimation1, { toValue: 1, duration: 300, useNativeDriver: false }),
            Animated.timing(dotAnimation2, { toValue: 1, duration: 300, useNativeDriver: false }),
            Animated.timing(dotAnimation3, { toValue: 1, duration: 300, useNativeDriver: false }),
            Animated.timing(dotAnimation1, { toValue: 0, duration: 300, useNativeDriver: false }),
            Animated.timing(dotAnimation2, { toValue: 0, duration: 300, useNativeDriver: false }),
            Animated.timing(dotAnimation3, { toValue: 0, duration: 300, useNativeDriver: false }),
          ])
        ).start();
      };

      animateDots();

      // Create smoke trail as plane flies
      let smokeIndex = 0;
      const createSmokeTrail = () => {
        const interval = setInterval(() => {
          const currentX = (planePosition.x as any)._value;
          const currentY = (planePosition.y as any)._value;
          
          if (currentX > -40 && currentX < width + 40 && currentY > -40 && currentY < height + 40) {
            const newSmoke: SmokePoint = {
              id: `smoke-${smokeIndex++}`,
              x: currentX - 40,
              y: currentY + 25,
              opacity: new Animated.Value(0.8),
              size: 18 + Math.random() * 10
            };
            
            setSmokeTrail(prev => [...prev, newSmoke]);
            
            // Fade out this smoke point after creation
            setTimeout(() => {
              Animated.timing(newSmoke.opacity, {
                toValue: 0,
                duration: 1800,
                useNativeDriver: false,
              }).start();
            }, 50);
          }
        }, 100);

        setTimeout(() => clearInterval(interval), 2300);
      };

      // Start plane animation immediately
      Animated.timing(planePosition, {
        toValue: { x: width + 80, y: height * 0.25 }, // Center trajectory
        duration: 2200, // Slightly slower for better visibility
        useNativeDriver: false,
      }).start();

      // Start creating smoke trail immediately when plane starts moving
      setTimeout(createSmokeTrail, 100);

      // Title fade in
      setTimeout(() => {
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }).start();
      }, 600);

      // Navigate to main app after animation completes
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2700);
    };

    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundOverlay} />
      
      {/* Static smoke trail points */}
      {smokeTrail.map((smoke) => (
        <Animated.View
          key={smoke.id}
          style={[
            styles.smokePoint,
            {
              left: smoke.x,
              top: smoke.y,
              width: smoke.size,
              height: smoke.size,
              borderRadius: smoke.size / 2,
              opacity: smoke.opacity,
            },
          ]}
        />
      ))}
      
      {/* Animated plane - more visible */}
      <Animated.View
        style={[
          styles.plane,
          {
            transform: [
              { translateX: planePosition.x },
              { translateY: planePosition.y },
              { rotate: '45deg' }, // Perfect angle to face top-right corner
            ],
            opacity: 1, // Ensure full opacity
          },
        ]}
      >
        <Ionicons name="airplane" size={70} color="#1e3a8a" />
      </Animated.View>

      {/* App title - in front */}
      <Animated.View
        style={[
          styles.titleContainer,
          { opacity: titleOpacity },
        ]}
      >
        <Text style={styles.appTitle}>TravelBuddy</Text>
        <Text style={styles.appSubtitle}>Your Journey Begins Here</Text>
      </Animated.View>

      {/* Loading indicator - in front */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <Animated.View 
            style={[
              styles.dot, 
              { 
                opacity: dotAnimation1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { 
                opacity: dotAnimation2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { 
                opacity: dotAnimation3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf6', // Ivory background
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(253, 250, 246, 0.95)',
    zIndex: 1,
  },
  plane: {
    position: 'absolute',
    zIndex: 15, // Higher than everything else to ensure visibility
    shadowColor: '#1e3a8a',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 20,
  },
  smokePoint: {
    position: 'absolute',
    backgroundColor: 'rgba(51, 51, 51, 0.7)', // More visible charcoal smoke
    zIndex: 4, // Behind plane
  },
  titleContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: height * 0.35,
    zIndex: 10, // In front of everything
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333', // Charcoal
    marginBottom: 12,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#e5c07b', // Champagne Gold
    fontWeight: '500',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignItems: 'center',
    zIndex: 10, // In front of everything
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5c07b',
    marginHorizontal: 4,
  },
});

export const options = { headerShown: false }; 