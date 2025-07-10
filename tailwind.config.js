/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neumorphic': '9px 9px 16px #bebebe, -9px -9px 16px #ffffff',
        'neumorphic-inset': 'inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff',
        'neumorphic-button': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};