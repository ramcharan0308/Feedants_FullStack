export const COLORS = {
  primary: '#0F766E',          // Deep Teal
  primaryLight: '#CCECE6',     // Light Teal Pill
  primaryBg: '#F0FDFA',        // Very soft Teal Background
  primaryDark: '#0F524C',      // Dark Teal for active toggle
  accent: '#0284C7',           // Electric Blue
  warning: '#D97706',          // Amber / Gold for timers
  warningBg: '#FEF3C7',        // Soft Gold pill
  success: '#10B981',          // Green for success/registered
  successBg: '#D1FAE5',        // Soft Green
  danger: '#EF4444',           // Red
  cardBg: '#FFFFFF',
  screenBg: '#F8FAFC',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  white: '#FFFFFF',
  shadowColor: 'rgba(15, 23, 42, 0.08)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  title: { fontSize: 20, fontWeight: '700' as const, color: COLORS.textPrimary },
  heading: { fontSize: 16, fontWeight: '700' as const, color: COLORS.textPrimary },
  subheading: { fontSize: 14, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 13, fontWeight: '400' as const, color: COLORS.textSecondary, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '400' as const, color: COLORS.textMuted },
  badge: { fontSize: 11, fontWeight: '700' as const },
};
