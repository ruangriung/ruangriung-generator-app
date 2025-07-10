import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#e0e0e0',
      },
      boxShadow: {
        'neumorphic': '9px 9px 16px #bebebe, -9px -9px 16px #ffffff',
        'neumorphic-inset': 'inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff',
        'neumorphic-button': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        'neumorphic-button-active': 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      },
    },
  },
  plugins: [],
}
export default config