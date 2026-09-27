import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, SafeAreaView, Text } from 'react-native';
import { useCompetitionDetails } from '../hooks/useCompetitionDetails';
import { DEMO_CONFIG } from '../constants/config';
import { TopHeaderNavBar } from '../components/competition/TopHeaderNavBar';
import { CompetitionHeaderCard } from '../components/competition/CompetitionHeaderCard';
import { JudgeCard } from '../components/competition/JudgeCard';
import { CountdownBanner } from '../components/competition/CountdownBanner';
import { ImportantDatesGrid } from '../components/competition/ImportantDatesGrid';
import { PreviousWinnersCarousel } from '../components/competition/PreviousWinnersCarousel';
import { CompetitionTabsView } from '../components/competition/CompetitionTabsView';
import { RewardsList } from '../components/competition/RewardsList';
import { DisclaimerBanner } from '../components/competition/DisclaimerBanner';
import { TrustBadges } from '../components/competition/TrustBadges';
import { ReferAndEarnCard } from '../components/competition/ReferAndEarnCard';
import { UserFeedbackCard } from '../components/competition/UserFeedbackCard';
import { AdBanner } from '../components/competition/AdBanner';
import { StickyBottomCTA } from '../components/competition/StickyBottomCTA';
import { BottomNavBar } from '../components/competition/BottomNavBar';
import { SubmissionModal } from '../components/competition/SubmissionModal';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ErrorView } from '../components/common/ErrorView';
import { COLORS } from '../constants/theme';

interface CompetitionDetailsScreenProps {
  competitionId?: string;
  userId?: string;
}

export const CompetitionDetailsScreen: React.FC<CompetitionDetailsScreenProps> = ({
  competitionId = DEMO_CONFIG.demoCompetitionId,
  userId = DEMO_CONFIG.demoUserId,
}) => {
  const { data, loading, registering, submitting, error, refetch, register, submitEntry } =
    useCompetitionDetails(competitionId, userId);

  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState<'ENG' | 'HI'>('ENG');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <TopHeaderNavBar currentLanguage={language} onLanguageToggle={setLanguage} />
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <TopHeaderNavBar currentLanguage={language} onLanguageToggle={setLanguage} />
        <ErrorView message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (!data || !data.competition) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <TopHeaderNavBar currentLanguage={language} onLanguageToggle={setLanguage} />
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  const { competition, lifecycle, userState } = data;

  const displayTitle =
    language === 'HI' ? 'फीडएंट्स क्लासिकल डांस प्रतियोगिता' : competition.title;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TopHeaderNavBar currentLanguage={language} onLanguageToggle={setLanguage} />

      {language === 'HI' ? (
        <View style={styles.langBanner}>
          <Text style={styles.langBannerText}>हिंदी भाषा सक्रिय है (Hindi Language Active)</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorToast}>
          <Text style={styles.errorToastText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
      >
        <CompetitionHeaderCard
          title={displayTitle}
          category={competition.category}
          tags={competition.tags}
          certificateProvided={competition.certificateProvided}
          prizePool={competition.prizePool}
          entryFee={competition.entryFee}
          totalSpots={competition.totalSpots}
          bookedSpots={competition.bookedSpots}
          remainingSpots={competition.remainingSpots}
          isRegistered={userState.isRegistered}
        />

        {competition.judge && <JudgeCard judge={competition.judge} />}

        <CountdownBanner secondsUntilClose={lifecycle.secondsUntilRegistrationCloses} />

        <ImportantDatesGrid dates={competition.dates} />

        <PreviousWinnersCarousel competitionId={competition.id} />

        <CompetitionTabsView details={competition.details} />

        <RewardsList rewards={competition.rewards} />

        <DisclaimerBanner />

        <TrustBadges />

        <ReferAndEarnCard referralConfig={competition.referralConfig} />

        <UserFeedbackCard />

        <AdBanner />
      </ScrollView>

      {/* Sticky Bottom Actions Container */}
      <View style={styles.bottomFixedArea}>
        <StickyBottomCTA
          lifecycle={lifecycle}
          userState={userState}
          entryFee={competition.entryFee}
          submissionStartsDate={competition.dates.submissionStarts}
          onRegister={register}
          onOpenSubmissionModal={() => setSubmissionModalVisible(true)}
          registering={registering}
        />

        <BottomNavBar activeTab="Competitions" />
      </View>

      <SubmissionModal
        visible={submissionModalVisible}
        onClose={() => setSubmissionModalVisible(false)}
        onSubmit={submitEntry}
        submitting={submitting}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  langBanner: {
    backgroundColor: COLORS.primaryBg,
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  langBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  errorToast: {
    backgroundColor: COLORS.danger,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  errorToastText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomFixedArea: {
    backgroundColor: COLORS.cardBg,
  },
});
