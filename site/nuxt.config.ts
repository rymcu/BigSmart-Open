const docsSlugs = ['', 'quick-start', 'product-brief', 'user-manual', 'hardware', 'video-converter', 'firmware']
const newDocsRoutes = docsSlugs.flatMap(slug => [
  slug ? `/docs/${slug}` : '/docs',
  slug ? `/en/docs/${slug}` : '/en/docs'
])
const legacyDocsRoutes = [
  ...docsSlugs.map(slug => slug ? `/zh/${slug}` : '/zh'),
  ...docsSlugs.filter(Boolean).map(slug => `/en/${slug}`)
]
const rawDocsRoutes = docsSlugs.flatMap(slug => [
  slug ? `/raw/docs/${slug}.md` : '/raw/docs.md',
  slug ? `/raw/en/docs/${slug}.md` : '/raw/en/docs.md',
  slug ? `/raw/zh/${slug}.md` : '/raw/zh.md',
  slug ? `/raw/en/${slug}.md` : '/raw/en.md'
])

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 2
        }
      }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  ui: {
    fonts: false
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://rymcu.github.io/BigSmart-Open'
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/en',
        ...newDocsRoutes,
        ...legacyDocsRoutes,
        ...rawDocsRoutes
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'server',
    clientBundle: {
      icons: [
        'lucide:arrow-up-right',
        'lucide:check',
        'lucide:hash',
        'lucide:menu',
        'lucide:search',
        'lucide:x'
      ],
      scan: true,
      sizeLimitKb: 512
    },
    serverBundle: {
      collections: ['lucide', 'simple-icons']
    },
    fallbackToApi: false
  },

  image: {
    provider: 'none'
  },

  llms: {
    contentRawMarkdown: false,
    domain: 'https://rymcu.github.io/BigSmart-Open',
    title: 'RYMCU BigSmart Docs',
    description: 'Documentation, hardware resources, firmware, and tools for the RYMCU BigSmart ESP32-S3 development board.',
    full: {
      title: 'RYMCU BigSmart Docs - Full Documentation',
      description: 'Complete documentation for the RYMCU BigSmart ESP32-S3 development board.'
    },
    sections: [
      {
        title: '中文文档',
        contentCollection: 'docsZh'
      },
      {
        title: 'English Documentation',
        contentCollection: 'docsEn'
      }
    ]
  },

  mcp: {
    name: 'RYMCU BigSmart Docs'
  }
})
