import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface SubmissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (mediaUrl: string, caption?: string) => Promise<boolean>;
  submitting?: boolean;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  visible,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [mediaUrl, setMediaUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [caption, setCaption] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async () => {
    if (!mediaUrl.trim()) {
      setLocalError('Media URL is required');
      return;
    }

    setLocalError('');
    const success = await onSubmit(mediaUrl.trim(), caption.trim());
    if (success) {
      onClose();
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBg}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Competition Entry</Text>
            <TouchableOpacity onPress={onClose} disabled={submitting}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

          <Text style={styles.inputLabel}>Video / Media URL *</Text>
          <TextInput
            style={styles.input}
            value={mediaUrl}
            onChangeText={setMediaUrl}
            placeholder="https://example.com/dance_video.mp4"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Performance Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={caption}
            onChangeText={setCaption}
            placeholder="Describe your dance routine..."
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Entry</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 18,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    ...TYPOGRAPHY.subheading,
    fontSize: 12,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
