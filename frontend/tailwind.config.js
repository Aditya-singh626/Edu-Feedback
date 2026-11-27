/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4a69bd',
          600: '#3867d6',
          700: '#2f55b5',
        },
        primary: {
          DEFAULT: '#4a69bd',
          dark: '#3867d6',
          light: '#eef2ff',
        },
        accent: {
          DEFAULT: '#ff9f43',
          dark: '#f39c12',
        },
        sidebar: '#0f172a',
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
