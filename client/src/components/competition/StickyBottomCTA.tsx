import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ILifecycleInfo, IUserState } from '../../types/competition';
import { resolveCTAState } from '../../utils/ctaStateResolver';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface StickyBottomCTAProps {
  lifecycle: ILifecycleInfo;
  userState: IUserState;
  entryFee: number;
  submissionStartsDate: string;
  onRegister: () => void;
  onOpenSubmissionModal: () => void;
  registering?: boolean;
}

export const StickyBottomCTA: React.FC<StickyBottomCTAProps> = ({
  lifecycle,
  userState,
  entryFee,
  submissionStartsDate,
  onRegister,
  onOpenSubmissionModal,
  registering,
}) => {
  const cta = resolveCTAState(lifecycle, userState, submissionStartsDate, entryFee);

  const handlePress = () => {
    if (registering || cta.disabled) return;
    if (cta.action === 'REGISTER') {
      onRegister();
    } else if (cta.action === 'OPEN_SUBMISSION') {
      onOpenSubmissionModal();
    }
  };

  return (
    <View style={styles.fixedContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          (cta.disabled || registering) && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        disabled={cta.disabled || registering}
        activeOpacity={0.85}
        accessibilityLabel={cta.title}
        accessibilityRole="button"
      >
        {registering ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Processing Registration...</Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>{cta.title}</Text>
            {cta.subtitle ? <Text style={styles.subtitleText}>{cta.subtitle}</Text> : null}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedContainer: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 1,
  },
});
