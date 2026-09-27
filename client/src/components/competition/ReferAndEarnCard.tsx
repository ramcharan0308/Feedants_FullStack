import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { IReferralConfig } from '../../types/competition';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

interface ReferAndEarnCardProps {
  referralConfig?: IReferralConfig;
}

export const ReferAndEarnCard: React.FC<ReferAndEarnCardProps> = ({ referralConfig }) => {
  const [copied, setCopied] = useState(false);

  const code = referralConfig?.defaultCode || 'referral123';
  const referralLink = `https://feedants.com/r/${code}`;
  const rewardAmount = referralConfig?.rewardPerSignup || 10;

  const handleCopy = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        await Clipboard.setStringAsync(referralLink);
      }
    } catch (err) {
      try {
        if (typeof document !== 'undefined') {
          const input = document.createElement('input');
          input.value = referralLink;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }
      } catch (e) {
        console.warn('Copy fallback error:', e);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.megaphoneIconBox}>
          <Ionicons name="megaphone-outline" size={20} color={COLORS.primary} />
        </View>

        <View style={styles.titleCol}>
          <Text style={styles.title}>Refer & Earn more discount</Text>
          <View style={styles.inputCopyRow}>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={1}>
                {referralLink}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.copyBtn}
              onPress={handleCopy}
              activeOpacity={0.8}
              accessibilityLabel="Copy referral link"
            >
              <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.referActionCol}>
          <TouchableOpacity
            style={styles.referNowBtn}
            onPress={handleCopy}
            activeOpacity={0.8}
            accessibilityLabel="Refer Now"
          >
            <Text style={styles.referNowText}>{copied ? 'Copied!' : 'Refer Now'}</Text>
          </TouchableOpacity>
          <Text style={styles.rewardCaption}>
            You earn <Text style={styles.rewardHighlight}>{formatCurrency(rewardAmount)}</Text> for every signup
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E6F4F1',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: '#CCECE6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  megaphoneIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  inputCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: RADIUS.sm,
    borderBottomLeftRadius: RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 3,
    height: 26,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  copyBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: COLORS.border,
    borderTopRightRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
    paddingHorizontal: 8,
    height: 26,
    justifyContent: 'center',
  },
  copyText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  referActionCol: {
    marginLeft: SPACING.sm,
    alignItems: 'center',
    width: 100,
  },
  referNowBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  referNowText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  rewardCaption: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  rewardHighlight: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
