// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === 'development'

/**
 * Сайт публикуется как статика на GitHub Pages, поэтому базовый путь задаётся
 * снаружи: для проекта `MikeIv/resume` это `/resume/`, для локальной сборки — `/`.
 */
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

/** Абсолютный адрес сайта: canonical, sitemap, robots, JSON-LD, `llms.txt`. */
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://mikeiv.github.io/resume/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  /** Исходники приложения в `app/`. Каталог `server/` — в корне репозитория. */
  srcDir: 'app/',

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b0f14' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
      ],
    },
  },

  css: ['~/assets/styles/main.scss'],

  modules: ['@nuxt/eslint', '@nuxt/icon'],

  icon: {
    /** Иконки собираются на этапе сборки — в рантайме нет запросов к API. */
    serverBundle: 'local',
    collections: ['lucide'],
    mode: 'svg',
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  devtools: {
    enabled: isDev,
    timeline: { enabled: isDev },
  },

  typescript: {
    strict: true,
    typeCheck: 'build',
  },

  runtimeConfig: {
    public: {
      /** Публичный адрес сайта: canonical, ссылки в PDF, `llms.txt`, sitemap. */
      siteUrl,
    },
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/ats',
        '/resume.json',
        '/resume.txt',
        '/llms.txt',
        '/robots.txt',
        '/sitemap.xml',
      ],
      failOnError: true,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['app/assets/styles'],
        },
      },
    },
    build: {
      target: 'esnext',
      cssMinify: true,
    },
  },
})
