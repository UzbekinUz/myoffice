// Tailwind sozlamasi. Ranglar CSS o'zgaruvchilaridan olinadi — shu tufayli light/dark rejim oson almashadi.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        accent3: 'var(--accent3)',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], display: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        gradient: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        gradient: 'gradient 8s ease infinite',
      },
    },
  },
  plugins: [],
}
