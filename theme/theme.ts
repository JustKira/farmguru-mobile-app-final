import { createTheme, useTheme as useRestyleTheme } from '@shopify/restyle';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

const theme = createTheme({
  colors: {
    primary: '#38b000',
    primaryLight: 'rgba(56, 176, 0,0.35)',
    secondary: '#38b000',
    muted: '#ebedeb',
    border: '#E2E8F0',
    destructive: '#FF0058',
    warning: '#e67b02',
    softWarning: '#FFD400',
    destructiveLight: 'rgba(255, 0, 88, 0.35)',
    background: '#F2F2F2',
    foreground: '#000',
  },
  spacing: {
    xs_4: 4,
    s_8: 8,
    sm_12: 12,
    m_16: 16,
    ml_24: 24,
    l_32: 32,
    xl_64: 64,
  },
  borderRadii: {
    s_3: 3,
    m_6: 6,
    l_12: 12,
    xl_24: 24,
  },
  textVariants: {
    body: {
      fontSize: 16,
    },
    title: { fontSize: 20, fontWeight: 'bold' },
    large: {
      fontSize: 36,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    extra_large: {
      fontSize: 64,
      fontWeight: 'bold',
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
  buttonVariants: {
    defaults: {
      backgroundColor: 'muted',
    },
    primary: {
      backgroundColor: 'primary',
      padding: 'm_16',
      borderRadius: 'm_6',
    },
    secondary: {
      backgroundColor: 'secondary',
      padding: 'm_16',
      borderRadius: 'm_6',
    },
  },
});

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#9ef01a',
    secondary: '#38b000',
    destructive: '#FF0058',
    muted: '#1f211f',
    border: '#2d2e2d',
    background: '#030802',
    foreground: '#FFFFFF',
  },
};

export const useTheme = () => {
  return useRestyleTheme<Theme>();
};

export const makeStyles = <T extends NamedStyles<T> | NamedStyles<unknown>>(
  styles: (theme: Theme) => T
) => {
  return () => {
    return styles(theme);
  };
};

export type Theme = typeof theme;
export default theme;
