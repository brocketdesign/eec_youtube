/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eec-black': '#0a0a0a',
        'eec-card': '#1a1a1a',
        'eec-elevated': '#222222',
        'eec-green': '#00ff88',
        'eec-cyan': '#00d4aa',
        'eec-orange': '#ff6b35',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
