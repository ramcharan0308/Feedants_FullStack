import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'outline';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: COLORS.primaryBg, text: COLORS.primary, border: 'transparent' };
      case 'success':
        return { bg: '#E6F4F1', text: COLORS.primary, border: 'transparent' };
      case 'warning':
        return { bg: COLORS.warningBg, text: COLORS.warning, border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: COLORS.textSecondary, border: COLORS.border };
      default:
        return { bg: '#F1F5F9', text: COLORS.textSecondary, border: 'transparent' };
    }
  };

  const currentVariant = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentVariant.bg, borderColor: currentVariant.border },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, { color: currentVariant.text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    ...TYPOGRAPHY.badge,
  },
});
