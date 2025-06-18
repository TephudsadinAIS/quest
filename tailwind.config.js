/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'quiz-bg': '#1A1A1A',
        'quiz-card-light': '#FEECEB',
        'quiz-red': '#F96C6C',
        'quiz-red-dark': '#E05353',
        'quiz-text-dark': '#593B3A',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        'noto': ['"Noto Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}