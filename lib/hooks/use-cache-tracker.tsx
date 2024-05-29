import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCacheTracker = () => {
  const [cacheTimestamp, setCacheTimestamp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State to track if we're still loading the timestamp

  // Function to set the current timestamp in AsyncStorage
  const cacheTimeTrack = async () => {
    const timestamp: string = new Date().toISOString();
    await AsyncStorage.setItem('cache-time-stamp', timestamp);
    console.log('Cache Time Stamp Set', timestamp);
    setCacheTimestamp(timestamp); // Update local state after setting in AsyncStorage
    setIsLoading(false); // Mark loading as complete
  };

  // Load the timestamp from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTimestamp = async () => {
      const timestamp: string | null = await AsyncStorage.getItem('cache-time-stamp');
      setCacheTimestamp(timestamp);
      setIsLoading(false); // Mark loading as complete
    };
    loadTimestamp();
  }, []);
  // Function to check if the specified number of minutes have passed since the last cached timestamp
  const cacheTimeHasPassed = (minutes: number): boolean => {
    if (cacheTimestamp) {
      const lastTimestamp: Date = new Date(cacheTimestamp);
      const now: Date = new Date();
      const difference: number = (now.getTime() - lastTimestamp.getTime()) / 60000; // Convert milliseconds to minutes
      return difference > minutes;
    }
    return true; // If no timestamp is found, assume the time has passed
  };

  const clearTime = async () => {
    await AsyncStorage.removeItem('cache-time-stamp');
    setCacheTimestamp(null);
  };

  return { cacheTimeTrack, cacheTimeHasPassed, cacheTimestamp, isLoading, clearTime };
};

export default useCacheTracker;
