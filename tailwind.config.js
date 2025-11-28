/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Lacquer', 'cursive'], // H1, brand, hero titles
        'sans': ['Open Sans', 'sans-serif'], // Body, buttons, navigation
        'underdog': ['Lacquer', 'cursive'], // Legacy support
        'handwritten': ['Open Sans', 'sans-serif'], // Changed from Special Elite
        'book': ['Open Sans', 'sans-serif'], // Changed from Crimson Text
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["dracula"],
  },
}
