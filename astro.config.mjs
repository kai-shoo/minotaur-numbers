import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import netlify from '@astrojs/netlify/functions'

export default defineConfig({
  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
  output: 'server',
  adapter: netlify(),
})
