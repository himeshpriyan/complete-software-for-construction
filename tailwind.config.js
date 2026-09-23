/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // Primary construction orange accent
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        status: {
          success: {
            bg: '#ecfdf5',
            text: '#065f46',
            border: '#a7f3d0',
            dot: '#10b981'
          },
          warning: {
            bg: '#fffbeb',
            text: '#92400e',
            border: '#fde68a',
            dot: '#f59e0b'
          },
          danger: {
            bg: '#fef2f2',
            text: '#991b1b',
            border: '#fecaca',
            dot: '#ef4444'
          },
          info: {
            bg: '#eff6ff',
            text: '#1e40af',
            border: '#bfdbfe',
            dot: '#3b82f6'
          },
          neutral: {
            bg: '#f8fafc',
            text: '#475569',
            border: '#e2e8f0',
            dot: '#94a3b8'
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)',
        elevated: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        modern: '0 2px 12px 0 rgba(15, 23, 42, 0.03), 0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        float: '0 20px 25px -5px rgba(15, 23, 42, 0.07), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
