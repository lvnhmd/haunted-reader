/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bookish vintage Halloween palette
        'parchment': {
          50: '#fdfbf7',
          100: '#f8f4e8',
          200: '#f0e8d3',
          300: '#e8dbb8',
          400: '#dcc89d',
          500: '#d4ba8a',
          600: '#c9a872',
          700: '#b08d5c',
          800: '#8f7249',
          900: '#75603d',
        },
        'ink': {
          DEFAULT: '#1a1614',
          light: '#2d2621',
          lighter: '#4a3f35',
        },
        'spooky-orange': {
          DEFAULT: '#e67e22',
          light: '#f39c12',
          dark: '#d35400',
        },
      },
      fontFamily: {
        'handwritten': ['Caveat', 'Comic Sans MS', 'cursive'],
        'spooky': ['Creepster', 'cursive'],
        'book': ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
