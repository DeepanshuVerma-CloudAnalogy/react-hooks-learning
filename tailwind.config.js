/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        background: '#090d16',
        surface: '#0f172a',
        'surface-elevated': '#1e293b',
        'surface-card': 'rgba(30, 41, 59, 0.7)',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-strong': 'rgba(255, 255, 255, 0.16)',
        primary: {
          DEFAULT: '#38bdf8',
          hover: '#0ea5e9',
          glow: 'rgba(56, 189, 248, 0.3)',
        },
        accent: {
          DEFAULT: '#818cf8',
          hover: '#6366f1',
          glow: 'rgba(129, 140, 248, 0.3)',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'render-glow': 'renderFlash 0.6s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        renderFlash: {
          '0%': { outline: '2px solid #38bdf8', boxShadow: '0 0 15px rgba(56, 189, 248, 0.8)' },
          '100%': { outline: '2px solid transparent', boxShadow: 'none' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        }
      }
    },
  },
  plugins: [],
}
