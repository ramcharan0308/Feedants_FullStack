import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CompetitionDetailsScreen } from '../screens/CompetitionDetailsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootStackParamList = {
  CompetitionDetails: { competitionId?: string; userId?: string } | undefined;
  Home: undefined;
  Explore: undefined;
  Create: undefined;
  Competitions: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CompetitionDetails"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="CompetitionDetails" component={CompetitionDetailsScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Competitions" component={CompetitionDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
