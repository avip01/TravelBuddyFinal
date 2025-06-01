import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Immediately redirect to splash screen
    router.replace('/splash');
  }, []);

  // Return null since we're redirecting immediately
  return null;
}

export const options = { headerShown: false }; 