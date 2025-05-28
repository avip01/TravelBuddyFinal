/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0077b6',
        'primary-light': '#d0e0f0',
        'primary-dark': '#004a77',
        'muted': '#8a9ab0',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-light': '#9CA3AF',
        'bg-primary': '#ffffff',
        'bg-secondary': '#F9FAFB',
        'bg-tertiary': '#F3F4F6'
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'roboto-medium': ['Roboto_500Medium', 'sans-serif'],
        'roboto-bold': ['Roboto_700Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 