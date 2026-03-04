export interface ReadingTheme {
  name: string;
  background: string;
  text: string;
  heading: string;
  link: string;
  code: string;
}

export const themes: Record<string, ReadingTheme> = {
  light: {
    name: '明亮',
    background: '#FAFAF8',
    text: '#1D1D1F',
    heading: '#000000',
    link: '#007AFF',
    code: '#F5F5F7'
  },
  dark: {
    name: '深色',
    background: '#1C1C1E',
    text: '#E5E5E7',
    heading: '#FFFFFF',
    link: '#0A84FF',
    code: '#2C2C2E'
  },
  sepia: {
    name: '护眼',
    background: '#F4ECD8',
    text: '#5B4636',
    heading: '#3E2723',
    link: '#8B6914',
    code: '#E8DCC4'
  }
};
