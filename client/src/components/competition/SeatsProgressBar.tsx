import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface SeatsProgressBarProps {
  bookedSpots: number;
  totalSpots: number;
  remainingSpots: number;
}

export const SeatsProgressBar: React.FC<SeatsProgressBarProps> = ({
  bookedSpots,
  totalSpots,
  remainingSpots,
}) => {
  const safeTotal = Math.max(1, totalSpots);
  const safeBooked = Math.min(safeTotal, Math.max(0, bookedSpots));
  const progressPercent = Math.min(100, Math.max(0, (safeBooked / safeTotal) * 100));
  const safeRemaining = Math.max(0, remainingSpots);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.spotsRow}>
          <Ionicons name="people-outline" size={16} color={COLORS.primary} />
          <Text style={styles.spotsText}>Only {safeRemaining} spots left</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>

      <Text style={styles.bookedText}>
        {safeBooked} / {safeTotal} Booked
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotsText: {
    ...TYPOGRAPHY.subheading,
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 4,
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  bookedText: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
