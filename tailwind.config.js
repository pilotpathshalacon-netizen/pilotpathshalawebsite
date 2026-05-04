import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7db',
          300: '#ebdcad',
          600: '#8e7320',
          800: '#4a4438',
          900: '#2f2f2c'
        },
        accent: '#e9b400',
        primary_text: '#14161a',
        secondary_text: '#525866',
        tertiary_text: '#727887',
        border: '#d2d5dd',
        background: '#eff1f4',
        white: '#ffffff'
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [forms]
}
