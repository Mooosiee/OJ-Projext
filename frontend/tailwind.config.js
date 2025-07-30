/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        palanquin: ['Palanquin', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        playwrite: ["Playwrite AU QLD", 'cursive'], 
        comfortaa: ["Comfortaa","cursive"],
      },
      colors: {
        headerbg: "#282828",
        headertext: "#F5F5F5",
        background: "#181A20",      // Main background (unchanged) 
        "background-ii" : "#3E74FF", // Blue to MATCH THE primary-ii 
        surface: "#23272F",         // Cards, nav, header (unchanged)
        primary: "#7F5AF0",         // Modern purple (new)
        "primary-ii": "#933EFF",     // Another Shade of Purple
        secondary: "#2CB67D",       // Fresh teal (new)
        success: "#22C55E",         // Success (unchanged)
        error: "#EF4444",           // Error (unchanged)
        warning: "#F59E42",         // Warning (unchanged)
        'text-primary': "#F3F4F6",  // Main text (unchanged)
        'text-secondary': "#9CA3AF",// Subtle text (unchanged)
        border: "#374151",          // Borders, dividers (unchanged)
        accent: "#FFD803",          // Soft yellow accent (new)
        custom_btn: "#546E7A",      // Optional: use or replace as needed
      },
    },
  },
  plugins: [],
};
