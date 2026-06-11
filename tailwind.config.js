/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0A0A0F',
        'dark-card': '#111118',
        navy: '#1A1A2E',
        accent: '#2E5FA3',
        'accent-glow': '#4A7FD4',
        f1red: '#E10600',
        offwhite: '#F0F0F5',
        midgrey: '#8888A0',
        gridline: '#1E1E2E',
        // F1 timing-screen sector colours
        sector: {
          purple: '#B14BF4', // session best
          green: '#2EE6A8', // personal best
          yellow: '#FFD12E', // on pace
        },
      },
      fontFamily: {
        display: ['"Saira Condensed"', 'sans-serif'],
        body: ['"Titillium Web"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(46, 95, 163, 0.4)',
        'glow-blue-lg': '0 0 40px rgba(74, 127, 212, 0.35)',
        'glow-red': '0 0 20px rgba(225, 6, 0, 0.45)',
        'glow-purple': '0 0 14px rgba(177, 75, 244, 0.45)',
        'glow-green': '0 0 14px rgba(46, 230, 168, 0.4)',
      },
    },
  },
  plugins: [],
}
