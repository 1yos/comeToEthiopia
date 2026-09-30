import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // These reference CSS variables — never use raw hex in components
        ochre:    'var(--ochre)',
        indigo:   'var(--indigo)',
        sulphur:  'var(--sulphur)',
        highland: 'var(--highland)',
        paper:    'var(--paper)',
        ink:      'var(--ink)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body:    ['"Bricolage Grotesque"', 'sans-serif'],
        geez:    ['"Noto Serif Ethiopic"', 'serif'],
      },
      // Spacing intentionally sparse — we control rhythm in components
    },
  },
  plugins: [],
}

export default config
