module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#FF4F00',
        subtle: '#9EA3B0',
        marble: '#F4F4F6',
        erie: '#201E1F',
        dark: '#201E1F',
        disabled: '#D2D7DF',
      },
      borderRadius: {
        classic: '8px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
