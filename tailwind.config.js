/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  purge: {
    content: [
      "./src/**/*.{html,ts}",
    ],
    // These options are passed through directly to PurgeCSS
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e82c88', // Primary color
          200: '#fde7f2'
        },
        secondary: {
          DEFAULT: '#51328a', // Secondary color
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      inset: ["checked"],
      zIndex: ["hover", "active"],
    },
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
  },
}
