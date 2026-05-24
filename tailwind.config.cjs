/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: {
          DEFAULT: '#0b1220',
          soft: '#111a2d',
          muted: '#17223b'
        },
        accent: {
          DEFAULT: '#57d9ff',
          strong: '#0ea5e9'
        },
        status: {
          online: '#22c55e',
          offline: '#64748b',
          warning: '#f59e0b'
        }
      },
      boxShadow: {
        panel: '0 24px 80px rgba(2, 8, 23, 0.42)',
        glow: '0 0 0 1px rgba(87, 217, 255, 0.12), 0 20px 60px rgba(14, 165, 233, 0.18)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at top, rgba(87, 217, 255, 0.16), transparent 42%), linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 1))'
      }
    }
  },
  plugins: []
};
