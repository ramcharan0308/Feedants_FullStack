import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IJudge } from '../../types/competition';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface JudgeCardProps {
  judge: IJudge;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ judge }) => {
  const [imageError, setImageError] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const fallbackAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

  const handleWatchVideo = async () => {
    if (judge.introVideoUrl) {
      try {
        await Linking.openURL(judge.introVideoUrl);
      } catch (err) {
        console.warn('Could not open video URL:', judge.introVideoUrl);
      }
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageError ? fallbackAvatar : judge.avatarUrl || fallbackAvatar }}
        onError={() => setImageError(true)}
        style={styles.avatar}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.roleTitle}>Judge</Text>
        <Text style={styles.name}>{judge.name}</Text>
        <Text style={styles.designation}>{judge.designation}</Text>
        <Text style={styles.experience}>{judge.experienceYears}</Text>
      </View>

      <TouchableOpacity
        style={styles.introButton}
        onPress={() => setVideoModalVisible(true)}
        accessibilityLabel="Play Judge Intro Video"
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <View style={styles.playCircle}>
          <Ionicons name="play" size={14} color={COLORS.primary} style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.introButtonText}>Intro Video</Text>
      </TouchableOpacity>

      {/* Video Modal Preview */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={videoModalVisible}
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setVideoModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.modalHeaderIconCircle}>
              <Ionicons name="film" size={32} color={COLORS.primary} />
            </View>

            <Text style={styles.modalTitle}>{judge.name}</Text>
            <Text style={styles.modalRole}>{judge.designation}</Text>

            <Text style={styles.modalSubtitle}>
              Experience: {judge.experienceYears}
            </Text>

            <View style={styles.btnRow}>
              {judge.introVideoUrl ? (
                <TouchableOpacity
                  style={styles.watchVideoBtn}
                  onPress={handleWatchVideo}
                  activeOpacity={0.8}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                  <Text style={styles.watchVideoText}>Watch Video</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setVideoModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>Close Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: '#E2E8F0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  roleTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
  name: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  designation: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  experience: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  introButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  introButtonText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
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
  modalHeaderIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  modalTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 18,
    marginTop: SPACING.xs,
  },
  modalRole: {
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    fontSize: 12,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginRight: SPACING.xs,
  },
  watchVideoText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  modalCloseButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  modalCloseText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
});
