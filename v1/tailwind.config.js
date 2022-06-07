module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        custom: '0px 3px 12px rgba(0, 0, 0, 0.48)',
      },

      colors: {
        brand: '#FF4F00',
        subtle: '#9EA3B0',
        marble: '#F4F4F6',
        erie: '#201E1F',

        dark: {
          text: {
            primary: '#FFFFFF',
            secondary: '#7A7A7B',
            highlight: '#0066F9',
          },
          background: {
            primary: '#18181B',
            secondary: '#252527',
            tertiary: '#0E0E10',
          },
        },
        light: {
          text: {
            primary: '#000000',
            secondary: '#7d7d7d',
            highlight: '#0066F9',
          },
          background: {
            primary: '#F1F2F4',
            secondary: '#FFFFFF',
            tertiary: '#F0F2F5',
          },
        },
        background: { dark: '#18191A', light: '#F0F2F5' },
        text: {
          dark: '#FFFFFF',
          light: '#18191A',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
