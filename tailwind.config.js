// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      xs: "420px",
      md: "580px"
    },
    extend: {
      fontFamily: {
        main: ["Nunito", "serif"],
      },
      colors: {
        'primary': '#A170D9',
        'secondary': '#05CAB6',
        'tertiary': '#0088cc',
        'light': '#e2e8f0',
        'grey': '#64748b',
        'dark': '#334155',
      },
    },
  },
  darkMode: 'class',
};