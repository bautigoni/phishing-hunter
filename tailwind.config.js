/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        cyber: {
          50: '#eaf6ff',
          100: '#cfeaff',
          200: '#a4d7ff',
          300: '#6cbcff',
          400: '#2f99ff',
          500: '#0070ff',
          600: '#0050d4',
          700: '#003aa1',
          800: '#002a78',
          900: '#0b0f1a',
          950: '#05070f'
        },
        neon: {
          pink: '#ff3ea5',
          purple: '#9b5cff',
          green: '#3eff9b',
          yellow: '#ffe14a',
          orange: '#ff7a3e',
          red: '#ff3e6a',
          cyan: '#3effe1'
        },
        ink: {
          900: '#05070f',
          800: '#0b0f1a',
          700: '#11172a',
          600: '#1a2240',
          500: '#263057'
        }
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 198, 255, 0.45)',
        'glow-pink': '0 0 24px rgba(255, 62, 165, 0.45)',
        'glow-green': '0 0 24px rgba(62, 255, 155, 0.55)',
        'inner-glow': 'inset 0 0 24px rgba(255, 255, 255, 0.08)',
        card: '0 8px 24px rgba(0, 0, 0, 0.35), 0 2px 0 rgba(255, 255, 255, 0.05) inset'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 50% 0%, rgba(0,198,255,0.18), transparent 60%)',
        'neon-conic':
          'conic-gradient(from 180deg at 50% 50%, #00c6ff 0deg, #9b5cff 120deg, #ff3ea5 240deg, #00c6ff 360deg)'
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' }
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(0,198,255,0.4)' },
          '50%': { boxShadow: '0 0 0 16px rgba(0,198,255,0)' }
        },
        bgShift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(-2%,-1%,0)' }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' }
        }
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        pop: 'pop 320ms cubic-bezier(.2,.9,.3,1.2) both',
        shake: 'shake 360ms ease-in-out',
        shine: 'shine 2.4s linear infinite',
        pulseGlow: 'pulseGlow 1.6s ease-out infinite',
        bgShift: 'bgShift 20s ease-in-out infinite',
        scan: 'scan 2.2s linear infinite',
        blink: 'blink 1.1s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
