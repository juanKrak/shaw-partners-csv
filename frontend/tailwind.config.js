/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [plugin(({ addVariant }) => {
      addVariant('submitting', '&[data-status=submitting]')
      addVariant('group-submitting', ':merge(.group)[data-status=submitting] &')
      addVariant('peer-submitting', ':merge(.peer)[data-status=submitting] ~ &')
    
      addVariant('success', '&[data-status=success]')
      addVariant('group-success', ':merge(.group)[data-status=success] &')
      addVariant('peer-success', ':merge(.peer)[data-status=success] ~ &')
    
      addVariant('error', '&[data-status=error]')
      addVariant('group-error', ':merge(.group)[data-status=error] &')
      addVariant('peer-error', ':merge(.peer)[data-status=error] ~ &')
  })],
}