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
        surface: '#fcf9f8',
        'surface-container-high': '#eae7e7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0eded',
        'surface-dim': '#dcd9d9',
        'surface-variant': '#e5e2e1',
        'surface-bright': '#fcf9f8',
        'surface-tint': '#465f88',
        'tertiary': '#090b0c',
        'tertiary-container': '#202222',
        'tertiary-fixed': '#e2e2e2',
        'tertiary-fixed-dim': '#c6c6c6',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#888989',
        'on-tertiary-fixed': '#1a1c1c',
        'on-tertiary-fixed-variant': '#454747',
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#44474e',
        'on-primary': '#ffffff',
        'on-primary-container': '#708ab5',
        'on-primary-fixed': '#001b3d',
        'on-primary-fixed-variant': '#2d476f',
        'secondary': '#7f5700',
        'secondary-container': '#feb316',
        'secondary-fixed': '#ffdead',
        'secondary-fixed-dim': '#ffba3b',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#6a4800',
        'on-secondary-fixed': '#281900',
        'on-secondary-fixed-variant': '#604100',
        'inverse-surface': '#313030',
        'inverse-on-surface': '#f3f0ef',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'outline': '#74777f',
        'outline-variant': '#c4c6cf'
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      },
      spacing: {
        'section-gap': '120px',
        gutter: '24px',
        'margin-desktop': '80px',
        unit: '8px',
        'margin-mobile': '20px'
      },
      fontFamily: {
        sans: ['Montserrat', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
        'title-md': ['Montserrat'],
        'headline-lg': ['Montserrat'],
        'headline-lg-mobile': ['Montserrat'],
        'body-md': ['Hanken Grotesk'],
        'display-lg': ['Montserrat'],
        'body-lg': ['Hanken Grotesk'],
        'label-sm': ['Hanken Grotesk']
      },
      fontSize: {
        'title-md': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'display-lg': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }]
      }
    }
  },
  plugins: [forms]
}
