/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        headerbg: "#282828",
        headertext:"#F5F5F5",
        background: '#181A20',       // Main background
        surface: '#23272F',          // Cards, nav, header
        primary: '#2563EB',          // Primary accent (blue)
        secondary: '#06B6D4',        // Secondary accent (cyan)
        success: '#22C55E',          // Success (green-500)
        error: '#EF4444',            // Error (red-500)
        warning: '#F59E42',          // Warning (amber)
        'text-primary': '#F3F4F6',   // Main text
        'text-secondary': '#9CA3AF', // Subtle text
        border: '#374151'           // Borders, dividers
      }},
  },
  plugins: [],
}
