import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ICompetitionDetailsContent } from '../../types/competition';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface CompetitionTabsViewProps {
  details: ICompetitionDetailsContent;
}

export const CompetitionTabsView: React.FC<CompetitionTabsViewProps> = ({ details }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'judging' | 'rules'>('about');
  const [expanded, setExpanded] = useState(false);

  const tabs = [
    { key: 'about', label: 'About Competition' },
    { key: 'judging', label: 'Judging Parameters' },
    { key: 'rules', label: 'Rules & Eligibility' },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View>
            <Text style={styles.bodyText} numberOfLines={expanded ? undefined : 3}>
              {details.about}
            </Text>
          </View>
        );
      case 'judging':
        return (
          <View>
            {details.judgingParameters.map((param, i) => (
              <View key={i} style={styles.listItemRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.primary} />
                <Text style={styles.listItemText}>{param}</Text>
              </View>
            ))}
          </View>
        );
      case 'rules':
        return (
          <View>
            {details.rulesAndEligibility.map((rule, i) => (
              <View key={i} style={styles.listItemRow}>
                <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} />
                <Text style={styles.listItemText}>{rule}</Text>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={styles.card}>
      {/* Tab Header Row */}
      <View style={styles.tabsHeaderContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab(tab.key);
                setExpanded(false);
              }}
              activeOpacity={0.7}
              accessibilityLabel={`Select ${tab.label}`}
              accessibilityRole="tab"
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content Body */}
      <View style={styles.contentBody}>{renderContent()}</View>

      {/* View More / View Less Toggle */}
      {activeTab === 'about' && (
        <TouchableOpacity
          style={styles.viewMoreBtn}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewMoreText}>{expanded ? 'View less' : 'View more'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabsHeaderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: SPACING.md,
  },
  tabButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginRight: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  contentBody: {
    minHeight: 48,
  },
  bodyText: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  listItemText: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    paddingVertical: 6,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
});
