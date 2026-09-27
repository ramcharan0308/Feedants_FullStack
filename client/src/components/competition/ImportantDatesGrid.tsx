import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ICompetitionDates } from '../../types/competition';
import { formatDateFull } from '../../utils/formatters';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ImportantDatesGridProps {
  dates: ICompetitionDates;
}

export const ImportantDatesGrid: React.FC<ImportantDatesGridProps> = ({ dates }) => {
  const dateItems = [
    {
      title: 'Register Before',
      dateObj: dates.registerBefore,
      icon: 'calendar-outline',
    },
    {
      title: 'Submission Starts',
      dateObj: dates.submissionStarts,
      icon: 'paper-plane-outline',
    },
    {
      title: 'Submission Ends',
      dateObj: dates.submissionEnds,
      icon: 'arrow-up-circle-outline',
    },
    {
      title: 'Result Date',
      dateObj: dates.resultDate,
      icon: 'trophy-outline',
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionHeader}>Important Dates</Text>
      <View style={styles.grid}>
        {dateItems.map((item, index) => {
          const { dateStr, timeStr } = formatDateFull(item.dateObj);
          return (
            <View key={index} style={styles.gridCell}>
              <View style={styles.cellIconRow}>
                <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                <View style={styles.cellTextCol}>
                  <Text style={styles.cellTitle}>{item.title}</Text>
                  <Text style={styles.dateValue}>{dateStr}</Text>
                  <Text style={styles.timeValue}>{timeStr}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  sectionHeader: {
    ...TYPOGRAPHY.heading,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCell: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cellIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cellTextCol: {
    marginLeft: SPACING.xs,
    flex: 1,
  },
  cellTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  timeValue: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
