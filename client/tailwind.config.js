/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070708',
          900: '#0B0B0C',
          850: '#121214',
          800: '#18181B',
          750: '#202024',
          700: '#27272C',
          600: '#3F3F46',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F0E6D2',
          300: '#E5D1AA',
          400: '#DAB87F',
          500: '#D4AF37', // Gold Accent
          600: '#C59B27',
          700: '#A17B1A',
          800: '#7E5F17',
          900: '#5E4515',
        },
        cream: {
          50: '#FDFCF9',
          100: '#F9F7F1',
          200: '#F3EFE6',
          300: '#E8E2D5',
          400: '#D9D0C1',
          500: '#C5B9A5',
          600: '#A39682',
        },
        terracotta: {
          500: '#C85A32',
          600: '#B04B26',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gold-glow': 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(11, 11, 12, 0) 70%)',
      },
      boxShadow: {
        'gold-subtle': '0 4px 20px -2px rgba(212, 175, 55, 0.15)',
        'gold-glow': '0 0 30px 2px rgba(212, 175, 55, 0.25)',
        'dark-card': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
