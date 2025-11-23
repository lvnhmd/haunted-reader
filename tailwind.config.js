/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spooky-purple': '#8b5cf6',
        'spooky-green': '#10b981',
        'spooky-orange': '#f97316',
      },
    },
  },
  plugins: [],
}
