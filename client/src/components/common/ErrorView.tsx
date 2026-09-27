import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
      <Text style={styles.title}>Unable to Load Competition</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Retry Connection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.heading,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  message: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
