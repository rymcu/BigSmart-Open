import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

const docsSchema = z.object({
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    target: z.string().optional()
  })).optional()
})

export default defineContentConfig({
  collections: {
    docsZh: defineCollection({
      type: 'page',
      source: {
        include: '1.zh/**',
        prefix: '/docs'
      },
      schema: docsSchema
    }),
    docsEn: defineCollection({
      type: 'page',
      source: {
        include: '2.en/**',
        prefix: '/en/docs'
      },
      schema: docsSchema
    }),
    legacyDocsZh: defineCollection({
      type: 'page',
      source: {
        include: '1.zh/**',
        prefix: '/zh'
      },
      schema: docsSchema
    }),
    legacyDocsEn: defineCollection({
      type: 'page',
      source: {
        include: '2.en/**',
        prefix: '/en'
      },
      schema: docsSchema
    })
  }
})
