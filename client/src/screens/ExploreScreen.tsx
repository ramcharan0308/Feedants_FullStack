import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { TopHeaderNavBar } from '../components/competition/TopHeaderNavBar';
import { BottomNavBar } from '../components/competition/BottomNavBar';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <TopHeaderNavBar title="Explore" />
      
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="compass" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Explore Competitions</Text>
        <Text style={styles.subtitle}>
          Search and filter through ongoing talent challenges across classical, hip-hop, and folk categories.
        </Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CompetitionDetails')}
          activeOpacity={0.8}
        >
          <Ionicons name="trophy-outline" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Go to Featured Competition</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar activeTab="Explore" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    maxWidth: 320,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
