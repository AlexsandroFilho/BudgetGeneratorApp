import { useColorScheme } from 'react-native';

const Colors = {
  light: {
    text: '#101B11', // Verde-preto para texto
    background: '#F8F9FA', // Cinza claro, similar ao da web
    primary: '#228F2F', // Verde-vivo
    secondary: '#5856D6', // Manter por enquanto ou escolher um tom complementar
    boxBackground: '#BCDBBC', // Verde-claro
    icon: '#113815', // Verde-escuro para ícones
    button: '#113815', // Verde-escuro para botões
  },
  dark: {
    text: '#EAEAEA',
    background: '#101B11', // Verde-preto para fundo
    primary: '#228F2F', // Verde-vivo
    secondary: '#5E5CE6',
    boxBackground: '#1C2A1D', // Um verde bem escuro para as caixas
    icon: '#FFFFFF',
    button: '#BCDBBC', // Botão claro no tema escuro
  },
};

export type ThemeProps = {
  // Accept both forms: `light`/`dark` (used at call sites) and `lightColor`/`darkColor` (historic/explicit)
  light?: string;
  dark?: string;
  lightColor?: string;
  darkColor?: string;
};

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: ThemeProps,
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  // Prefer the shorthand `light`/`dark` if provided, fall back to `lightColor`/`darkColor`.
  const colorFromProps =
    theme === 'light'
      ? props.light ?? props.lightColor
      : props.dark ?? props.darkColor;

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}