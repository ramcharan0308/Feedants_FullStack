import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export const AdBanner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <Ionicons name="megaphone-outline" size={16} color={COLORS.textMuted} style={{ marginRight: 6 }} />
      <Text style={styles.text}>Ad Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    fontWeight: '600',
  },
});
