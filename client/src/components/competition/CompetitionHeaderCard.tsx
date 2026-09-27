import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../common/Badge';
import { SeatsProgressBar } from './SeatsProgressBar';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

interface CompetitionHeaderCardProps {
  title: string;
  category: string;
  tags: string[];
  certificateProvided: boolean;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  remainingSpots: number;
  isRegistered?: boolean;
}

export const CompetitionHeaderCard: React.FC<CompetitionHeaderCardProps> = ({
  title,
  category,
  tags,
  certificateProvided,
  prizePool,
  entryFee,
  totalSpots,
  bookedSpots,
  remainingSpots,
  isRegistered,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {isRegistered && (
          <Badge
            label="Registered"
            variant="success"
            icon={<Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />}
          />
        )}
      </View>

      <View style={styles.tagsRow}>
        <Badge label={category} variant="neutral" style={styles.tagMargin} />
        {tags.map((tag, idx) => (
          <Badge key={idx} label={tag} variant="neutral" style={styles.tagMargin} />
        ))}
        {certificateProvided && (
          <Badge
            label="Winners get certificate"
            variant="primary"
            icon={<Ionicons name="trophy-outline" size={12} color={COLORS.primary} />}
          />
        )}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.statValue}>{formatCurrency(prizePool)}</Text>
        </View>

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.statValue}>{formatCurrency(entryFee)}</Text>
        </View>

        <View style={styles.statColFlex}>
          <SeatsProgressBar
            bookedSpots={bookedSpots}
            totalSpots={totalSpots}
            remainingSpots={remainingSpots}
          />
        </View>
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
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 22,
    flex: 1,
    marginRight: SPACING.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  tagMargin: {
    marginRight: 6,
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statCol: {
    marginRight: SPACING.md,
  },
  statColFlex: {
    flex: 1,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
});
