export const LightTheme = {
  primary: '#667EEA',
  secondary: '#F56565',
  success: '#48BB78',
  warning: '#ED8936',
  info: '#4299E1',
  background: '#FFFFFF',
  surface: '#F7FAFC',
  cardFront: '#FFFFFF',
  cardBack: '#F7FAFC',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  border: '#E2E8F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const DarkTheme = {
  primary: '#7F9CF5',
  secondary: '#FC8181',
  success: '#68D391',
  warning: '#F6AD55',
  info: '#63B3ED',
  background: '#1A202C',
  surface: '#2D3748',
  cardFront: '#2D3748',
  cardBack: '#4A5568',
  textPrimary: '#F7FAFC',
  textSecondary: '#CBD5E0',
  border: '#4A5568',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export const Typography = {
  h1: {
    fontSize: 34,
    fontWeight: 'bold' as const,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    fontFamily: 'System',
  },
  h4: {
    fontSize: 18,
    fontWeight: '500' as const,
    fontFamily: 'System',
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    fontFamily: 'System',
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '400' as const,
    fontFamily: 'System',
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    fontFamily: 'System',
  },
  cardFront: {
    fontSize: 24,
    fontWeight: '500' as const,
    fontFamily: 'System',
  },
  cardBack: {
    fontSize: 18,
    fontWeight: '400' as const,
    fontFamily: 'System',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 999,
};

export type Theme = typeof LightTheme;
