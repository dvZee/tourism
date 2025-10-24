/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#3f5b66',
        'accent-primary': '#bb7261',
      },
      fontFamily: {
        'breton': ['Breton', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
