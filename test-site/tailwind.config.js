import tailwindConfig from '../tailwind.config'

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "node_modules/@yext/chat-ui-react/lib/**/*.{js,jsx}",
  ],
  theme: {
    ...tailwindConfig.theme
  },
  plugins: [...tailwindConfig.plugins],
};
