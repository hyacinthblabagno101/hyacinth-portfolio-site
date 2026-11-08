// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const siteData = JSON.parse(readFileSync(new URL('./src/data/site.json', import.meta.url), 'utf8'));

/** Until resumeConfirmed is true in site.json, the draft resume PDF is removed from the live build. */
const dropDraftResume = {
  name: 'drop-draft-resume',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (siteData.resumeConfirmed) return;
      rmSync(fileURLToPath(new URL(siteData.resumeFile.replace(/^\//, ''), dir)), { force: true });
    },
  },
};

export default defineConfig({
  site: 'https://hyacinthblabagno.work',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap(), dropDraftResume],
});
