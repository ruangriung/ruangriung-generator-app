import type { Config } from 'tailwindcss'

const config = {
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
        'dark-bg': '#2b2b2b', // <--- BARU: Warna latar belakang gelap utama
        'dark-neumorphic-light': '#363636', // <--- BARU: Warna bayangan terang untuk neumorphic gelap
        'dark-neumorphic-dark': '#202020',   // <--- BARU: Warna bayangan gelap untuk neumorphic gelap
      },
      boxShadow: {
        // Shadow untuk mode terang (sudah ada)
        'neumorphic': '9px 9px 16px #bebebe, -9px -9px 16px #ffffff',
        'neumorphic-inset': 'inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff',
        'neumorphic-button': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        'neumorphic-button-active': 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',

        // <--- BARU: Shadow untuk mode gelap
        'dark-neumorphic': '9px 9px 16px #202020, -9px -9px 16px #363636',
        'dark-neumorphic-inset': 'inset 9px 9px 16px #202020, inset -9px -9px 16px #363636',
        'dark-neumorphic-button': '5px 5px 10px #202020, -5px -5px 10px #363636',
        'dark-neumorphic-button-active': 'inset 5px 5px 10px #202020, inset -5px -5px 10px #363636',
      },
    },
  },
  plugins: [],
}
export default config