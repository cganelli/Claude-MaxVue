/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'garamond': ['EB Garamond', 'serif'],
      },
      colors: {
        'vivid-blue': {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#3399FF', // Main brand color (Light Blue)
          600: '#0066e6',
          700: '#0052cc',
          800: '#003d99',
          900: '#002966',
        },
        'dark-blue': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1D4262', // Dark Blue for hover/outlines
        }
      },
      spacing: {
        '20': '5rem', // 80px for bottom navigation padding
      }
    },
  },
  plugins: [],
};