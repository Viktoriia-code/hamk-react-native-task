import { Platform } from "react-native";

const theme = {
  roundness: 3,
  roundnessXl: 10,
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    textPlaceholder: '#9CA3AF',
    white: '#fcfcfc',
    primary: '#6b89b3',
    bgSecondary: '#24292e',
    bgMain: '#e6e6e6',
    error: '#d73a4a',
    border: '#ededed'
  },
  fontSizes: {
    body: 14,
    subheading: 16,
    heading: 18,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    medium: '600',
    bold: '700',
  },
};

export default theme;