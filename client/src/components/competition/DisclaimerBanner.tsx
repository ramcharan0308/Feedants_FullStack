import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const DisclaimerBanner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={styles.icon} />
      <Text style={styles.text}>
        <Text style={styles.boldText}>Disclaimer: </Text>
        Only contributions from paid participants will be considered for judging.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4F1',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
