import { Platform } from 'react-native';

// In Expo, localhost works for web/desktop, 10.0.2.2 for Android emulator
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getBaseUrl();

export const DEMO_CONFIG = {
  // Demo User seeded in database (Demo Participant)
  demoUserId: '6ab8ffc731f29eaaf5047da8',
  // Seeded Competition ID (Feedants Classical Dance)
  demoCompetitionId: '6ab8ffc731f29eaaf5047daa',
};
