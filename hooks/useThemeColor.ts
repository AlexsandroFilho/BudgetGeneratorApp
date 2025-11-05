import { useColorScheme } from 'react-native';

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    primary: '#007AFF',
    secondary: '#5856D6',
    boxBackground: '#F5F5F5',
    icon: '#2C2C2C'
  },
  dark: {
    text: '#fff',
    background: '#000',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    boxBackground: '#1C1C1E',
    icon: '#FFFFFF'
  },
};

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: ThemeProps,
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme === 'light' ? 'lightColor' : 'darkColor'];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}