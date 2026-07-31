/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#BCF5FF',      // Light Cyan
          sky: '#7BBBFF',       // Sky Blue
          purple: '#5C55E1',    // Indigo Purple
          green: '#9ED454',     // Fresh Green
          sand: '#C9A37C',      // Warm Sand
          dark: '#1B1743',      // Deep Indigo Dark Mode/Header Text
        },
        navy: {
          50: '#f4f4fe',
          100: '#e7e7fc',
          200: '#d0d1f9',
          500: '#5C55E1',
          800: '#1F1B4E',
          900: '#131034',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-bengali)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-manrope)', 'var(--font-noto-bengali)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-noto-bengali)', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #5C55E1 0%, #7BBBFF 100%)',
        'hero-gradient': 'linear-gradient(135deg, #1F1B4E 0%, #3B3398 50%, #5C55E1 100%)',
        'soft-gradient': 'linear-gradient(180deg, #BCF5FF 0%, #FFFFFF 100%)',
        'sand-gradient': 'linear-gradient(135deg, #C9A37C 0%, #E2C7A8 100%)',
        'fresh-gradient': 'linear-gradient(135deg, #9ED454 0%, #7BBBFF 100%)',
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
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
