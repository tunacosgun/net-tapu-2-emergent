import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-cabinet)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eefbf3',
          100: '#d6f5e1',
          200: '#b0eac8',
          300: '#7cd9a8',
          400: '#46c284',
          500: '#24a86a',
          600: '#168754',
          700: '#126c45',
          800: '#115639',
          900: '#0f4730',
          950: '#07281b',
        },
        emerald: {
          primary: '#24A86A',
          hover: '#1D8B57',
          light: '#D1FAE5',
        },
        auction: {
          live: '#22c55e',
          ending: '#f59e0b',
          scheduled: '#3b82f6',
          ended: '#6b7280',
          dark: '#0B0F19',
        },
      },
      boxShadow: {
        'emerald': '0 0 15px rgba(36, 168, 106, 0.3)',
        'emerald-lg': '0 0 30px rgba(36, 168, 106, 0.4)',
        'auction-pulse': '0 0 20px rgba(239, 68, 68, 0.5)',
      },
      keyframes: {
        'bid-flash': {
          '0%': { backgroundColor: 'rgb(34 197 94 / 0.3)', transform: 'scale(1.02)' },
          '50%': { backgroundColor: 'rgb(34 197 94 / 0.15)' },
          '100%': { backgroundColor: 'transparent', transform: 'scale(1)' },
        },
        'bid-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-emerald': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(36, 168, 106, 0.7)' },
          '50%': { boxShadow: '0 0 0 12px rgba(36, 168, 106, 0)' },
        },
      },
      animation: {
        'bid-flash': 'bid-flash 1.5s ease-out, bid-slide-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-emerald': 'pulse-emerald 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
