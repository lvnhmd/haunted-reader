/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
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
