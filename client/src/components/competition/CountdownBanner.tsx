import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCountdown } from '../../hooks/useCountdown';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface CountdownBannerProps {
  secondsUntilClose: number;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ secondsUntilClose }) => {
  const { formatted, isExpired } = useCountdown(secondsUntilClose);

  return (
    <View style={styles.banner}>
      <View style={styles.leftGroup}>
        <Ionicons name="hourglass-outline" size={18} color={COLORS.primary} />
        <Text style={styles.labelText}>
          {isExpired ? 'Registration ended' : 'Registration closes in'}
        </Text>
      </View>

      <View style={styles.timerGroup}>
        <Text style={styles.timerText}>
          {isExpired
            ? '00d : 00h : 00m : 00s'
            : `${formatted.days} : ${formatted.hours} : ${formatted.mins} : ${formatted.secs}`}
        </Text>
      </View>

      <View style={styles.hurryBadge}>
        <Ionicons name="timer-outline" size={14} color={COLORS.primary} />
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F4F1',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    ...TYPOGRAPHY.subheading,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  timerGroup: {
    paddingHorizontal: SPACING.xs,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  hurryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hurryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 3,
  },
});
