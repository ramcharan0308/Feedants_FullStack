import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export const UserFeedbackCard: React.FC = () => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.iconBox}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.textPrimary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>Hear From Our Users</Text>
        <Text style={styles.subtitle}>See what participants say about Feedants</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
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
  iconBox: {
    marginRight: SPACING.sm,
  },
  textCol: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.subheading,
    fontSize: 12,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    marginTop: 1,
  },
});
