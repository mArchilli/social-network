/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      height: {
        'footer': '100px',
      },
      gridTemplateRows: {
        'layout': '60px 1fr 100px',
      }
    },
  },
  plugins: [],
}
