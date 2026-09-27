import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IReward } from '../../types/competition';
import { formatCurrency } from '../../utils/formatters';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface RewardsListProps {
  rewards: IReward[];
}

export const RewardsList: React.FC<RewardsListProps> = ({ rewards }) => {
  const getRankIcon = (pos: number) => {
    switch (pos) {
      case 1:
        return <Ionicons name="trophy" size={18} color="#D97706" />;
      case 2:
        return <Ionicons name="ribbon" size={18} color="#64748B" />;
      case 3:
        return <Ionicons name="medal" size={18} color="#B45309" />;
      default:
        return <Ionicons name="star-outline" size={18} color={COLORS.primary} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>Rewards</Text>
        <Text style={styles.subHeader}>(All Positions)</Text>
      </View>

      <View style={styles.list}>
        {rewards.map((reward, index) => (
          <View key={index} style={styles.rewardRow}>
            <View style={styles.leftGroup}>
              {getRankIcon(reward.position)}
              <Text style={styles.rankTitle}>{reward.title}</Text>
            </View>
            <Text style={styles.rewardAmount}>{formatCurrency(reward.amount)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    ...TYPOGRAPHY.heading,
    fontSize: 14,
    marginRight: 6,
  },
  subHeader: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
  list: {
    marginTop: 2,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  rewardAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
