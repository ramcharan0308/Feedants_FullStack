import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TopHeaderNavBarProps {
  title?: string;
  onBackPress?: () => void;
  currentLanguage?: 'ENG' | 'HI';
  onLanguageToggle?: (lang: 'ENG' | 'HI') => void;
}

export const TopHeaderNavBar: React.FC<TopHeaderNavBarProps> = ({
  title,
  onBackPress,
  currentLanguage,
  onLanguageToggle,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [internalLang, setInternalLang] = useState<'ENG' | 'HI'>('ENG');

  const lang = currentLanguage || internalLang;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleLangChange = (selectedLang: 'ENG' | 'HI') => {
    setInternalLang(selectedLang);
    if (onLanguageToggle) {
      onLanguageToggle(selectedLang);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        <Text style={styles.backText}>{title || 'Go back'}</Text>
      </TouchableOpacity>

      <View style={styles.langToggleContainer}>
        <TouchableOpacity
          style={[styles.langOption, lang === 'ENG' && styles.langOptionActive]}
          onPress={() => handleLangChange('ENG')}
          accessibilityLabel="Select English language"
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, lang === 'ENG' && styles.langTextActive]}>ENG</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langOption, lang === 'HI' && styles.langOptionActive]}
          onPress={() => handleLangChange('HI')}
          accessibilityLabel="Select Hindi language"
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, lang === 'HI' && styles.langTextActive]}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    ...TYPOGRAPHY.heading,
    marginLeft: SPACING.xs,
    fontSize: 15,
  },
  langToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    padding: 2,
  },
  langOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  langOptionActive: {
    backgroundColor: COLORS.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  langTextActive: {
    color: COLORS.white,
  },
});
