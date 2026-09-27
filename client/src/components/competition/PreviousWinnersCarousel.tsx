import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCompetitionWinners } from '../../services/competitionService';
import { IWinnerItem } from '../../types/competition';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface PreviousWinnersCarouselProps {
  competitionId: string;
}

export const PreviousWinnersCarousel: React.FC<PreviousWinnersCarouselProps> = ({ competitionId }) => {
  const [winners, setWinners] = useState<IWinnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedWinner, setSelectedWinner] = useState<IWinnerItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCompetitionWinners(competitionId)
      .then((data) => {
        if (isMounted) setWinners(data);
      })
      .catch(() => {
        if (isMounted) setWinners([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [competitionId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>Previous Winners</Text>
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 12 }} />
      </View>
    );
  }

  if (winners.length === 0) {
    return null;
  }

  const fallbackWinnerImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const handleWatchWinningVideo = async (url?: string) => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (err) {
        console.warn('Could not open video URL:', url);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Previous Winners</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {winners.map((winner) => {
          const isFailed = failedImages[winner.id];
          return (
            <TouchableOpacity
              key={winner.id}
              style={styles.winnerCard}
              onPress={() => setSelectedWinner(winner)}
              activeOpacity={0.8}
              accessibilityLabel={`View ${winner.userName}'s winning performance`}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: isFailed ? fallbackWinnerImage : winner.avatarUrl }}
                  onError={() => setFailedImages((prev) => ({ ...prev, [winner.id]: true }))}
                  style={styles.avatarImage}
                />
                <View style={styles.playOverlay}>
                  <Ionicons name="play-circle" size={26} color={COLORS.white} />
                </View>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.winnerName} numberOfLines={1}>
                  {winner.userName}
                </Text>
                <Text style={styles.rankTitle}>{winner.rankTitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Winner Video Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedWinner}
        onRequestClose={() => setSelectedWinner(null)}
      >
        {selectedWinner && (
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedWinner(null)}>
                <Ionicons name="close-circle" size={28} color={COLORS.white} />
              </TouchableOpacity>

              <Image source={{ uri: selectedWinner.avatarUrl }} style={styles.modalAvatar} />

              <Text style={styles.modalWinnerName}>{selectedWinner.userName}</Text>
              <Text style={styles.modalRankTitle}>{selectedWinner.rankTitle}</Text>
              <Text style={styles.modalCaption}>Winning Performance Entry</Text>

              <View style={styles.modalBtnRow}>
                {selectedWinner.winningVideoUrl ? (
                  <TouchableOpacity
                    style={styles.modalPlayBtn}
                    onPress={() => handleWatchWinningVideo(selectedWinner.winningVideoUrl)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="play" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                    <Text style={styles.modalPlayBtnText}>Watch Winning Routine</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedWinner(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    paddingLeft: SPACING.lg,
  },
  sectionHeader: {
    ...TYPOGRAPHY.heading,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingRight: SPACING.lg,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 170,
  },
  imageWrapper: {
    position: 'relative',
    width: 54,
    height: 54,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    marginLeft: SPACING.xs,
    flex: 1,
  },
  winnerName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rankTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: -40,
    right: 0,
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: SPACING.xs,
  },
  modalWinnerName: {
    ...TYPOGRAPHY.heading,
    fontSize: 18,
  },
  modalRankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  modalCaption: {
    ...TYPOGRAPHY.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  modalBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginRight: SPACING.xs,
  },
  modalPlayBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  modalCloseBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  modalCloseBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
});
