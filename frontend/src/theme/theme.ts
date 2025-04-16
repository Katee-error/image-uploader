import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0099ff',
      600: '#0077cc',
      700: '#005599',
      800: '#003366',
      900: '#001133',
    },
    accent: {
      50: '#fff8e6',
      100: '#ffecb3',
      200: '#ffe080',
      300: '#ffd44d',
      400: '#ffc91a',
      500: '#ffbf00',
      600: '#cc9900',
      700: '#997300',
      800: '#664d00',
      900: '#332600',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.600' },
        },
        secondary: {
          bg: 'gray.100',
          color: 'gray.800',
          _hover: { bg: 'gray.200' },
        },
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: { bg: 'accent.600' },
        },
      },
    },
    Card: {
      baseStyle: {
        p: '6',
        borderRadius: 'lg',
        boxShadow: 'md',
        bg: 'white',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

