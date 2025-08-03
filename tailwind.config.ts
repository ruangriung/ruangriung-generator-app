import type { Config } from 'tailwindcss'

const config: Config = { // Menambahkan anotasi tipe Config
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-bg': '#e0e0e0',
        'dark-bg': '#2b2b2b',
        'dark-neumorphic-light': '#363636',
        'dark-neumorphic-dark': '#202020',
      },
      boxShadow: {
        'neumorphic': '9px 9px 16px #bebebe, -9px -9px 16px #ffffff',
        'neumorphic-inset': 'inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff',
        'neumorphic-button': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        'neumorphic-button-active': 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',

        'dark-neumorphic': '9px 9px 16px #202020, -9px -9px 16px #363636',
        'dark-neumorphic-inset': 'inset 9px 9px 16px #202020, inset -9px -9px 16px #363636',
        'dark-neumorphic-button': '5px 5px 10px #202020, -5px -5px 10px #363636',
        'dark-neumorphic-button-active': 'inset 5px 5px 10px #202020, inset -5px -5px 10px #363636',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <<< TAMBAHKAN BARIS INI
  ],
}
export default config