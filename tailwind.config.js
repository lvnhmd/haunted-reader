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
        'book': ['Lato', 'sans-serif'],
        'underdog': ['Underdog', 'cursive'],
        'sans': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        haunted: {
          "primary": "#e67e22",           // Spooky orange
          "secondary": "#9333ea",         // Purple
          "accent": "#10b981",            // Green accent
          "neutral": "#1a1614",           // Dark ink
          "base-100": "#fdfbf7",          // Parchment light
          "base-200": "#f8f4e8",          // Parchment
          "base-300": "#f0e8d3",          // Parchment darker
          "info": "#3b82f6",              // Blue
          "success": "#10b981",           // Green
          "warning": "#f39c12",           // Amber
          "error": "#ef4444",             // Red
        },
      },
      "halloween",  // Built-in Halloween theme
      "dark",       // Built-in dark theme
      "dracula",    // Built-in Dracula theme
    ],
    darkTheme: "halloween",
    base: true,
    styled: true,
    utils: true,
  },
}
