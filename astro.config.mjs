import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  vite: {
    css: {
      transformer: "lightningcss",
    },
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
});
