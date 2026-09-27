import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { COLORS, SPACING } from '../../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomNavBarProps {
  activeTab?: 'Home' | 'Explore' | 'Create' | 'Competitions' | 'Profile';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab = 'Competitions' }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleTabPress = (route: keyof RootStackParamList) => {
    if (route === activeTab && route === 'Competitions') return;
    navigation.navigate(route as any);
  };

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.7}
        onPress={() => handleTabPress('Home')}
        accessibilityLabel="Navigate to Home"
        accessibilityRole="tab"
      >
        <Ionicons
          name={activeTab === 'Home' ? 'home' : 'home-outline'}
          size={20}
          color={activeTab === 'Home' ? COLORS.primary : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'Home' && styles.activeNavLabel]}>Home</Text>
      </TouchableOpacity>

      {/* Explore */}
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.7}
        onPress={() => handleTabPress('Explore')}
        accessibilityLabel="Navigate to Explore"
        accessibilityRole="tab"
      >
        <Ionicons
          name={activeTab === 'Explore' ? 'search' : 'search-outline'}
          size={20}
          color={activeTab === 'Explore' ? COLORS.primary : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'Explore' && styles.activeNavLabel]}>Explore</Text>
      </TouchableOpacity>

      {/* + / Create */}
      <TouchableOpacity
        style={styles.plusNavItem}
        activeOpacity={0.7}
        onPress={() => handleTabPress('Create')}
        accessibilityLabel="Navigate to Create"
        accessibilityRole="tab"
      >
        <View style={styles.plusCircle}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </View>
      </TouchableOpacity>

      {/* Competitions */}
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.7}
        onPress={() => handleTabPress('Competitions')}
        accessibilityLabel="Navigate to Competitions"
        accessibilityRole="tab"
      >
        <Ionicons
          name="trophy"
          size={20}
          color={activeTab === 'Competitions' ? COLORS.primary : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'Competitions' && styles.activeNavLabel]}>
          Competitions
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.7}
        onPress={() => handleTabPress('Profile')}
        accessibilityLabel="Navigate to Profile"
        accessibilityRole="tab"
      >
        <Ionicons
          name={activeTab === 'Profile' ? 'person' : 'person-outline'}
          size={20}
          color={activeTab === 'Profile' ? COLORS.primary : COLORS.textMuted}
        />
        <Text style={[styles.navLabel, activeTab === 'Profile' && styles.activeNavLabel]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.xs,
    height: 56,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  plusNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  plusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  activeNavLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
