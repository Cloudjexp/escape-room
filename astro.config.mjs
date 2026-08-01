// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://cloudjexp.github.io/escape-room/
  site: 'https://cloudjexp.github.io',
  base: '/escape-room',
  vite: {
    plugins: [tailwindcss()],
  },
});
