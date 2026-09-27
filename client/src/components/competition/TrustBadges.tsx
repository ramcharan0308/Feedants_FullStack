import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export const TrustBadges: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        <View style={styles.playIconBox}>
          <Ionicons name="play" size={16} color={COLORS.primary} style={{ marginLeft: 2 }} />
        </View>
        <View style={styles.leftTextCol}>
          <Text style={styles.title}>How will you receive prize money?</Text>
          <Text style={styles.subtitle}>Watch video to know more</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.rightCol}>
        <View style={styles.badgeRow}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.badgeText}>Refund policy</Text>
        </View>

        <View style={styles.badgeRow}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.badgeText}>Secure payments powered by </Text>
          <Text style={styles.razorpayText}>Razorpay</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leftCol: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: '#CCECE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftTextCol: {
    marginLeft: SPACING.xs,
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 15,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: SPACING.sm,
  },
  rightCol: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  razorpayText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
});
